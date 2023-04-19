//===========================================================================================
//          The main part in the AsmX compiler, the Kernel is also the main part.
//===========================================================================================

// requires
const fs = require('fs');

// Components that compiler
const { UnitError, FileError } = require('./anatomics.errors');
const ValidatorByType = require('./checker');
const { FlowOutput, FlowInput } = require('./flow');
const Issues = require("./issue");
const { Memory, MemoryAddress, MemoryVariables } = require("./memory");
const Parser = require('./parser');
const Route = require("./route");
const Stack = require("./stack");
const unitCall = require('./unit.call');

class Compiler {
    constructor(AbstractSyntaxTree) {
        this.AbstractSyntaxTree = AbstractSyntaxTree; // <Type> - array
        const Switching = { state: false };
        this.options = arguments[2];
        this.scope = arguments[1] || 'global'; // or 'local'
        this.type = this.options?.registers?.type || 'Program';
        this.argsScopeLocal = this.options?.argsScopeLocal || {}; // arguments from the unit
        this.set = [];
        this.constants = [];
        const PATH_TO_SYSTEMS_DIRECTORY = './systems';
        
        // Call this args
        this.$arg0 = 0x00;
        this.$arg1 = 0x00;
        this.$arg2 = 0x00;
        this.$arg3 = 0x00;
        this.$arg4 = 0x00;
        this.$arg5 = 0x00;
        
        
        /* Setting up the compiler. */
        // models
        this.stack = new Stack();
        this.$route = new Route();
        this.$mem = Memory;
        this.$stack = this.stack;
    
        // Stack
        this.$sp = this.$stack.sp; // Stack pointer
        this.$lis = this.$stack.list[this.$stack.sp - 1]?.value; // Last item in stack
        this.$fis = this.$stack.list[0x00]?.value; // First item in stack
        // Other
        this.$args = {};
        this.$offset = 0x00;
        this.$name = 0x00;
        this.$text = ''; // Text to display
        this.$math = 0x00;
        // jmp
        this.$count = 0x01;
        // return
        this.$urt = false;
        this.ret = false;
        // Execute registers
        this.$mov = 0x00;
        // Logical registers
        this.$eq = 0x00;    // a == b
        this.$seq = 0x00; // a === b
        this.$cmp = false;  // a > b
        this.$xor = 0x00;   // a ^ b
        this.$and = false;  // a && b
        this.$or = false;   // a || b
        this.$b_and = false; // a & b
        this.$b_or = false; // a | b
        // Immutable registers
        this.$out = 0x00;
        this.$arch = "AsmX";

        this.$args = ['$arg0', '$arg1', '$arg2', '$arg3', '$arg4', '$arg5'];
        this.$registers = ['$mem', '$stack', '$name', '$offset', '$arch', '$urt', '$ret', '$out', '$eq', '$sp', '$fis', '$lis'];
        this.$extensionRegisters = [...this.$args, ...this.$registers];


        if (this.options?.registers && typeof arguments[2] != 'undefined' && typeof arguments[2] == 'object') {
            this.$arg0 = this.options.registers['$arg0'];
            this.$arg1 = this.options.registers['$arg1'];
            this.$arg2 = this.options.registers['$arg2'];
            this.$arg3 = this.options.registers['$arg3'];
            this.$arg4 = this.options.registers['$arg4'];
            this.$arg5 = this.options.registers['$arg5'];
            this.$mov = this.options.registers['$mov'];
            this.$sp = this.options.registers['$sp'];
            this.$offset = this.options.registers['$offset'];
            this.$out = this.options.registers['$out'];
            this.$name = this.options.registers['$name'];
            this.$ret = this.options.registers['$ret'];
            this.$urt = this.options.registers['$urt'];
            this.set = this.options.registers['set'];
            this.scope = this.options.registers['scope'];
            this.$math = this.options.registers['$math'];
            this.$count = this.options.registers['$count'];
            this.type = this.options.registers['type'];
            // Logical registers
            this.$eq = this.options.registers['$eq'];
            this.$seq = this.options.registers['$seq'];
            this.$cmp = this.options.registers['$cmp'];
            this.$xor = this.options.registers['$xor'];
            this.$and = this.options.registers['$and'];
            this.$or = this.options.registers['$or'];
            this.$b_and = this.options.registers['$b_and'];
            this.$b_or = this.options.registers['$b_or'];
            // arguments in Unit
            this.argsScopeLocal = this.options.registers['argsScopeLocal'];

            if (this.options.registers?.constants && Array.isArray(this.options.registers.constants)) {
                let list = [];

                for (let index = 0, len = this.options.registers['constants']['length']; index < len; index++) {
                    list[index] = this.options.registers['constants'][index];
                }

                this.constants = Array.from(list);
            }
            
        }

        const alias = Parser.parse(fs.readFileSync(`${PATH_TO_SYSTEMS_DIRECTORY}/syscalls.asmX`, {encoding: 'utf-8' }));
            if (alias && alias instanceof Array)
                for (let index = 0; index < alias.length; index++) this.AbstractSyntaxTree.unshift(alias[index]);

                
        this.AbstractSyntaxTree.map(trace => {
            if (trace?.import){
                Switching.state && process.stdout.write(Issues.IMPORT_EVENT);
                const alias = this.compilerImport(trace.import);

                if (alias && alias instanceof Array)
                    for (let index = 0; index < alias.length; index++) this.AbstractSyntaxTree.unshift(alias[index]);
            }

            if (trace?.const) this.compilerDefine(trace.const);
        });


        for (let index = 0; index < this.AbstractSyntaxTree.length; index++) {
            const trace = this.AbstractSyntaxTree[index];

            if (trace?.issue){
                this.compileIssue(trace.issue, Switching);  
                continue;
            }

            if (trace?.invoke){
                Switching.state && process.stdout.write(Issues.INVOKE_EVENT);
                this.compileInvoke(trace.invoke);
                continue;
            }

            if (trace?.unit){
                Switching.state && process.stdout.write(Issues.CREATE_UNIT_EVENT);
                this.compilerUnitStatement(trace);
                continue;
            }

            if (trace?.call){
                Switching.state && process.stdout.write(Issues.CALL_EVENT);
                this.compilerCallUnit(trace.call);
                continue;
            }

            if (trace?.ret){
                Switching.state && process.stdout.write(Issues.RET_EVENT);
                this.compilerRet(trace.ret);
                continue;
            }

            if (trace?.set){
                Switching.state && process.stdout.write(Issues.SET_EVENT);
                this.compilerSetStatement(trace.set);
                continue;
            }

            if (trace?.memory){
                Switching.state && process.stdout.write(Issues.MEMORY_EVENT);
                this.compilerMemory(trace.memory);
                continue;
            }

            if (trace?.address){
                Switching.state && process.stdout.write(Issues.ADDRESS_EVENT);
                this.compilerAddress(trace.address);
                continue;
            }

            if (trace?.route){
                Switching.state && process.stdout.write(Issues.ROUTE_EVENT);
                this.compilerRoute(trace.route);
                continue;
            }

            if (trace?.stack){
                Switching.state && process.stdout.write(Issues.STACK_EVENT);
                this.compilerStack(trace.stack);
                continue;
            }

            if (trace?.add){
                Switching.state && process.stdout.write(Issues.CALCULATE_ADD_EVENT);
                this.compilerAddStatement(trace.add);
                continue;
            }

            if (trace?.sub){
                Switching.state && process.stdout.write(Issues.CALCULATE_SUB_EVENT);
                this.compilerSubStatement(trace.sub);
                continue;
            }

            if (trace?.equal){
                Switching.state && process.stdout.write(Issues.EQUALITY_EVENT);
                this.compilerEquality(trace.equal);
                continue;
            }

            if (trace?.div) {
                Switching.state && process.stdout.write(Issues.CALCULATE_DIV_EVENT);
                this.compilerDivStatement(trace.div);
                continue;
            }

            if (trace?.mod) {
                Switching.state && process.stdout.write(Issues.CALCULATE_MOD_EVENT);
                this.compilerModStatement(trace.mod);
                continue;
            }

            if (trace?.imul) {
                Switching.state && process.stdout.write(Issues.CALCULATE_IMUL_EVENT);
                this.compilerImulStatement(trace.imul);
                continue;
            }

            if (trace?.offset) {
                Switching.state && process.stdout.write(Issues.SET_OFFSET_EVENT);
                this.compilerOffset(trace.offset);
                continue;
            }

            if (trace?.unset) {
                Switching.state && process.stdout.write(Issues.UNSET_EVENT);
                this.compilerUnset(trace.unset);
                continue;
            }

            if (trace?.modify) {
                Switching.state && process.stdout.write(Issues.MODIFY_EVENT);
                this.compilerModify(trace.modify);
                continue;
            }

            if (trace?.execute) {
                Switching.state && process.stdout.write(Issues.EXECUTE_EVENT);
                this.compilerExecute(trace.execute, index);
                continue;
            }

            if (trace?.pop) {
                Switching.state && process.stdout.write(Issues.POP_EVENT);
                this.compilerPop();
                continue;
            }

            if (trace?.push) {
                Switching.state && process.stdout.write(Issues.PUSH_EVENT);
                this.compilerPush(trace.push);
                continue;
            }
        };
    }


    /**
     * It's a function that executes a statement
     * @param statement - { cmd: 'mov', args: [ '', '' ] }
     * @param index - The index of the current statement.
     */
    compilerExecute(statement, index) {
        this.$arg0 = statement.cmd;
        let args = statement.args;

       /* Checking if the argument is a hex, int, or float. If it is, it will return the argument. */
        args = args.map((arg) => {
            if (ValidatorByType.validateTypeHex(arg) || ValidatorByType.validateTypeInt(arg) || ValidatorByType.validateTypeFloat(arg)) {
                return  +this.checkArgument(arg) || +arg;
            } else {
                // if (ValidatorByType.validateTypeHex(arg) || ValidatorByType.validateTypeInt(arg) || ValidatorByType.validateTypeFloat(arg)) {
                //     return this.checkArgument(arg) || +arg;
                // } 

                return this.checkArgument(arg);
            }
        });

        let $idx = index || 1;
        
        if (this.$arg0 == 'inc')    this.$ret = this.$math = args[0] + 1;
        if (this.$arg0 == 'dec')    this.$ret = this.$math = args[0] - 1;
        if (this.$arg0 == 'div')    this.$ret = this.$math = args[0] / args[1];
        if (this.$arg0 == 'ceil')   this.$ret = this.$math = Math.ceil(args[0]);
        if (this.$arg0 == 'floor')  this.$ret = this.$math = Math.floor(args[0]);
        if (this.$arg0 == 'sqrt')   this.$ret = this.$math = Math.sqrt(args[0]);
        if (this.$arg0 == 'exp')    this.$ret = this.$math = Math.exp(args[0]);
        if (this.$arg0 == 'log')    this.$ret = this.$math = Math.log(args[0]);
        if (this.$arg0 == 'sin')    this.$ret = this.$math = Math.sign(args[0]);
        if (this.$arg0 == 'log10')  this.$ret = this.$math = Math.log10(args[0]);
        if (this.$arg0 == 'cos')    this.$ret = this.$math = Math.cos(args[0]);
        if (this.$arg0 == 'tan')    this.$ret = this.$math = Math.tan(args[0]);
        if (this.$arg0 == 'acos')   this.$ret = this.$math = Math.acos(args[0]);
        if (this.$arg0 == 'atan')   this.$ret = this.$math = Math.atan(args[0]);
        if (this.$arg0 == 'round')  this.$ret = this.$math = Math.round(args[0]);
        if (this.$arg0 == 'atan2')  this.$ret = this.$math = Math.atan2(args[0]);
        
        if (this.$arg0 == 'mov')    this.$ret = this.$mov = args[0];
        
        if (this.$arg0 == 'eq')     this.$ret = this.$eq = args[0] == args[1];
        if (this.$arg0 == 'seq')    this.$ret = this.$seq = args[0] === args[1];
        if (this.$arg0 == 'cmp')    this.$ret = this.$cmp = args[0] > args[1];
        if (this.$arg0 == 'xor')    this.$ret = this.$xor = args[0] ^ args[1];
        if (this.$arg0 == 'not')    this.$ret = this.$not = args[0] == 1 ? 0 : 1;
        if (this.$arg0 == 'and')    this.$ret = this.$and = args[0] && args[1];
        if (this.$arg0 == 'or')     this.$ret = this.$or = args[0] || args[1];
        if (this.$arg0 == 'b_and')  this.$ret = this.$b_and = args[0] & args[1];
        if (this.$arg0 == 'b_or')   this.$ret = this.$b_or = args[0] | args[1];
        
        if (this.$arg0 == 'jmp') {
            let source = [];
            let compile;
            
            for (let i = 1; i < args[0] + 1; i++) source.unshift(this.AbstractSyntaxTree[$idx - i]);

            this.$count = 0X01;
            for (let iterator = 0, $count = args[1]-1 || 1; iterator < $count; iterator++) {
                compile = new Compiler(source, this.scope, {
                    argsScopeLocal: this.options?.argsScopeLocal,
                    registers: {
                        $arg0: this.$arg0,
                        $arg1: this.$arg1,
                        $arg2: this.$arg2,
                        $arg3: this.$arg3,
                        $arg4: this.$arg4,
                        $arg5: this.$arg5,
                        // return
                        $ret: this.$ret,
                        $urt: this.$urt,
                        // ................
                        $mov: this.$mov,
                        // jmp counter
                        $count: this.$count+1,
                        type: 'cycle',
                        // Stack
                        $fis: this.$fis,
                        $lis: this.$lis,
                        $sp: this.$sp,
                        // Immutable registers
                        $out: this.$out,
                        // Other registers
                        $name: this.$name,
                        $offset: this.$offset,
                        $math: this.$math,
                        // private registers (private data)
                        set: this.set,
                        constants: this.constants,
                        scope: this.scope,
                        argsScopeLocal: this.argsScopeLocal,
                        // Logical registers
                        $cmp: this.$cmp,
                        $eq: this.$eq,
                        $seq: this.$seq,
                        $xor: this.$xor,
                        $and: this.$and,
                        $or: this.$or,
                        $b_and: this.$b_and,
                        $b_or: this.$b_or
                    }
                });
                
                // Logical registers
                this.$seq = compile.$seq;
                this.$and = compile.$and;
                this.$or = compile.$or;
                this.$b_and = compile.$b_and;
                this.$b_or = compile.$b_or;
                this.$eq = compile.$eq;

                this.$count = compile.$count;
                this.$math = compile.$math;
                this.$out = compile.$out;
                this.$ret = compile.$ret;
                this.$urt = compile.$urt;
                this.$mov = compile.$mov;
                this.$fis = compile.$fis;
                this.$lis = compile.$lis;
                this.$cmp = compile.$cmp;
                this.$offset = compile.$offset;
                this.$text = compile.$text;
                this.$sp = compile.$sp;
                this.$name = compile.$name;
                this.set = compile.set;
                this.constants = compile.constants;
                this.scope = compile.scope;
                this.argsScopeLocal = compile.argsScopeLocal;
                this.type = compile.type;

              //  (iterator == this.$count-1) ? this.type = 'Program' : this.type = 'cycle';
            }
        }

    }


    /**
     * This function pushes the first argument of the statement to the stack.
     * @param statement - The statement object that is being compiled.
     */
    compilerPush(statement) {
        this.$arg0 = this.checkArgument(statement.args[0]) || statement.args[0];
        this.$stack.push(this.$arg0);
    }


    /**
     * It removes the last element from the stack.
     */
    compilerPop() {
        this.$stack.pop();
    }

    /**
     * It takes a statement, and if the statement is not a variable, it sets the value of the variable
     * to the value of the statement.
     * @param statement - The statement that is being compiled.
     */
    compilerModify(statement) {
        this.$arg0 = statement.model;
        this.$arg1 = statement.value;
        if (this.$arg0 == '$text') this.$text = this.$arg1;
        if (this.$arg0 == '$offset') this.$offset = this.$arg1;
        if (this.$arg0 == '$sp') this.$sp = this.$arg1;
        if (this.$arg0 == '$mov') this.$mov = this.$arg1;
    }


    /**
     * The function above is used to unset a variable.
     * @param statement - The statement object.
     */
    compilerUnset(statement) {
        this.$arg0 =  this.compilerAllArguments(statement, 'String') || statement.model;
       
        if (this.$arg0 == 'mem') {
            Memory.unset();
            MemoryVariables.unsett();
            MemoryAddress.unset();
        }   else if (this.$arg0 == 'offset') this.$offset = 0x00
            else if (this.$arg0 == 'text')  this.$text = ''
            else if (this.$arg0 == 'sp') this.$sp = 0x00
    }


    /**
     * This function sets the offset to the value of the argument.
     * @param statement - The statement that is being compiled.
     */
    compilerOffset(statement) {
        this.$arg0 = statement.value;
        this.$offset = this.$arg0;
    }


    /**
     * This function takes a statement and adds it to the set.
     * @param statement - The statement object that is being compiled.
     */
    compilerDefine(statement) {
        this.$arg0 = this.$name = statement.name;
        this.$arg1 = statement.value;

        if (ValidatorByType.validateTypeHex(this.$arg1) 
            || ValidatorByType.validateTypeInt(this.$arg1) || ValidatorByType.validateTypeFloat(this.$arg1)) {
            this.$arg1 = +this.$arg1;
        } else if (ValidatorByType.validateByTypeString(this.$arg1)) {
            this.$arg1 = this.$arg1.slice(1, -1);
        }

        this.constants.push({ name: this.$arg0, value: this.$arg1 });
    }


    /**
     * The function reads a file from the file system and then parses it.
     * @param statement - The statement object to parse.
     */
    compilerImport(statement) {
        let filePath = ValidatorByType.validateByTypeString(statement.alias) ? statement.alias.slice(1, -1) : statement.alias;
        let fileForCompiler;

        if (filePath.lastIndexOf('.') > -1 && !filePath.startsWith('.asmx')) {
           new  FileError({
             message: FileError.FILE_EXTENSION_INVALID,
             lineCode: statement.linecode
           });
        }

        /* Reading a file from the file system. */
        try {
            if (ValidatorByType.validateByTypeString(statement.alias)) {
                fileForCompiler = fs.readFileSync(filePath, {encoding: 'utf-8' });
            } else if (ValidatorByType.validateTypeIdentifier(statement.alias)) {
                fileForCompiler = fs.readFileSync(`./libs/${filePath}.asmX`, {encoding: 'utf-8' });
            }

            let parser = Parser.parse(fileForCompiler);
            return parser;
        } catch {
            new FileError({
                message: FileError.FILE_NOT_FOUND,
                lineCode: statement.linecode
            });
        }
    }


    /**
    * It compiles a unit call statement
    * @param statement - The statement object.
    */
    compilerCallUnit(statement) {
       if (unitCall.has(statement.name)) {
            let unitcall = unitCall.get(`@Call ${statement.name}${statement.args}`, statement.name, statement.args.slice(1, -1));
            let argsMap = unitCall.getArgumentsHashMap(statement.name, statement.args.slice(1, -1));
            let compiler = new Compiler(unitcall, 'local', { argsScopeLocal: argsMap });
            compiler.$urt == false ? this.$urt = 0x00 : this.$ret = this.$urt = compiler.$urt;
       } else {
            new UnitError(`@Call ${statement.name}${statement.args}` , UnitError.UNIT_UNKNOWN);
       }
    }


    /**
     * It takes a statement, parses the unit, and then adds it to the unitCall object
     * @param statement - The statement object.
     */
    compilerUnitStatement(statement) {
        let unit = statement.unit;
        let unitParse = Parser.parseUnitStatement(unit[0]);
        let compilerUnit = unit.slice(1).join('\n');
        unitCall.set(unitParse.unit.name, unitParse.unit.rules, compilerUnit, unitParse.unit.argsnames);
    }


    /**
     * It checks the argument of the statement and returns it.
     * @param statement - The statement object that is being compiled.
     */
    compilerRet(statement) {
        if (this.scope == 'global') {
            process.stdout.write('You must specify a global scope before you compile the statement in the current process');
            this.compileInvoke({ address: 0x01 });
        } else if (this.scope == 'local') {
            this.$urt = this.checkArgument(statement.arg) || this.$ret || 0x00;
        }
    }


    /**
     * It's a function that compiles a statement that invokes a function
     * @param statement - The statement that is being compiled.
     */
    compileInvoke(statement) {
        this.$arg0 = this.checkArgument(statement.address) || statement.address;

        // write
        if (this.$arg0 == 0x04) FlowOutput.createOutputStream(this.$stack.list[this.$stack.sp + this.$offset - 1]?.value || this.$stack.list[this.$stack.sp - 1]?.value);
        // exit
        if (this.$arg0 == 0x01) process.exit(0);
        
        // read
        if (this.$arg0 == 0x03) {
            this.$arg0 = this.$out = FlowInput.createInputStream(this.$text);
            this.$stack.push({ value: this.$arg0 });
        }
    }


    /**
     * "This function takes a statement, maps the arguments to integers, reduces the arguments to a
     * single value, and pushes the result to the stack."
     * 
     * The first thing we do is map the arguments to integers. We do this by using the `parseInt`
     * function. The `parseInt` function takes two arguments: the first is the string to convert to an
     * integer, and the second is the base of the number. In this case, we're converting hexadecimal
     * numbers to integers.
     * 
     * The next thing we do is reduce the arguments to a single value. We do this by using the `reduce`
     * function. The `reduce` function takes two arguments: the first is a function that takes two
     * arguments, and the second is the initial value. In this case, the function takes two arguments:
     * the previous argument and the current argument. The initial value is the first argument.
     * 
     * The last thing we
     * @param statement - The statement object that is being executed.
     */
    compilerEquality(statement) {
        const args = statement.args.map(arg => parseInt(arg, 16));
        this.$ret = this.$eq = args.reduce((previousArg, currentArg) => previousArg === currentArg);
        if (isNaN(this.$ret)) this.$ret = 0x00;
        this.$stack.push({ value: this.$ret });
    }


    /**
     * "This function compiles a statement that multiplies all of its arguments together and pushes the
     * result onto the stack."
     * 
     * The first thing the function does is call the compilerAllArguments function. This function takes
     * the statement and the type of the arguments as parameters. The compilerAllArguments function
     * will then compile all of the arguments in the statement and store them in the  through
     *  variables.
     * 
     * The next thing the function does is multiply all of the arguments together and store the result
     * in the  variable.
     * 
     * The last thing the function does is push the result onto the stack.
     * @param statement - The statement object.
     */
    compilerImulStatement(statement) {
        this.compilerAllArguments(statement, 'Int');
        this.$ret = this.$arg0 * this.$arg1;
        if (this.$arg2 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret * this.$arg2;
        if (this.$arg3 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret * this.$arg3;
        if (this.$arg4 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret * this.$arg4;
        if (this.$arg5 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret * this.$arg5;
        if (isNaN(this.$ret)) this.$ret = 0x00;
        this.$stack.push({ value: this.$ret });
    }


    /**
     * "This function takes a statement, and then compiles it into a JavaScript function that will
     * divide all of the arguments together and then push the result onto the stack."
     * 
     * The first thing that the function does is call the compilerAllArguments function. This function
     * takes the statement, and then compiles it into a JavaScript function that will push all of the
     * arguments onto the stack.
     * 
     * The next thing that the function does is set the  variable to the result of dividing all of
     * the arguments together.
     * 
     * The last thing that the function does is push the result onto the stack.
     * @param statement - The statement to be compiled.
     */
    compilerDivStatement(statement) {
        this.compilerAllArguments(statement, 'Int');
        this.$ret = this.$arg0 / this.$arg1;
        if (this.$arg2 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret / this.$arg2;
        if (this.$arg3 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret / this.$arg3;
        if (this.$arg4 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret / this.$arg4;
        if (this.$arg5 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret / this.$arg5;
        if (isNaN(this.$ret)) this.$ret = 0x00;
        this.$stack.push({ value: this.$ret });
    }


    /**
     * "This function takes a statement, and compiles it into a JavaScript function that returns the
     * remainder of the first argument divided by the second argument."
     * 
     * The first line of the function is a comment. It's a comment because it starts with a double
     * slash. Comments are ignored by the compiler.
     * 
     * The second line of the function is a function call. It's a function call because it starts with
     * the name of a function, followed by a pair of parentheses. The function call is to the function
     * "compilerAllArguments". The function call passes two arguments to the function. The first
     * argument is the statement. The second argument is the string "Int".
     * 
     * The third line of the function is an assignment. It's an assignment because it starts with a
     * dollar sign, followed by an equal sign. The assignment assigns the value of the first argument
     * to the variable "".
     * 
     * The fourth line of the
     * @param statement - The statement object.
     */
    compilerModStatement(statement) {
        this.compilerAllArguments(statement, 'Int');
        this.$ret = this.$arg0 % this.$arg1;
        if (this.$arg2 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret % this.$arg2;
        if (this.$arg3 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret % this.$arg3;
        if (this.$arg4 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret % this.$arg4;
        if (this.$arg5 !== 0x00 || typeof this.$arg2 == 'undefined') this.$ret = this.$ret % this.$arg5;
        if (isNaN(this.$ret)) this.$ret = 0x00;
        this.$stack.push({ value: this.$ret });
    }


    /**
     * It takes a statement object, and adds the arguments together, and pushes the result to the
     * stack.
     * @param statement - The statement object that is being compiled.
     */
    compilerAddStatement(statement) {
        this.compilerAllArguments(statement, 'Int');
        this.$ret = this.$arg0 + this.$arg1 + this.$arg2 + this.$arg3 + this.$arg4 + this.$arg5;
        this.$stack.push({ value: this.$ret });
    }


    /**
     * It takes a statement, and then it does some stuff with it.
     * @param statement - The statement object that is being compiled.
     */
    compilerSubStatement(statement) {
        this.compilerAllArguments(statement, 'Int');
        this.$ret = this.$arg0 - this.$arg1 - this.$arg2 - this.$arg3 - this.$arg4 - this.$arg5;
        if (isNaN(this.$ret)) this.$ret = 0x00;
        this.$stack.push({ value: this.$ret });
    }


    /**
     * "The compilerStack function pushes the address of the statement to the stack, and then pushes
     * the name of the live point to the stack."
     * 
     * The compilerStack function is called by the compiler when it encounters a statement that is a
     * live point.
     * 
     * The compilerStack function is called by the compiler when it encounters a
     * @param statement - The statement object that is being compiled.
     */
    compilerStack(statement) {
        this.$arg0 = statement.address;
        this.$ret = 0x00;

        /**
         * If the row has a value property, then call the function again with the value property as the
         * row. Otherwise, return the value property
         * @param row - the row object
         * @returns The value of the key 'value' in the object.
         */
        function recursionGetValueByStack(row) {
            return Object.keys(row.value).includes('value') ? recursionGetValueByStack(row.value) : row.value;
        }

        /* Getting the value of the last item in the stack, and then pushing it to the stack. */
        this.$ret = recursionGetValueByStack(this.$stack.list[this.$stack.list.length - 1]);
        this.$stack.push({ address: this.$mov.livePointAddress, value: this.$ret });
    }


    /**
     * It takes a statement, gets the name and address of the statement, gets the cell by the name of
     * the statement, gets the value of the cell by the address of the cell, sets the return value to
     * the value of the cell, pushes the address and value of the cell to the stack, and sets the point
     * of the mov to the name and address of the statement
     * @param statement - The statement that is being compiled.
     */
    compilerRoute(statement) {
        if (!(typeof statement.address === 'undefined')) {
            this.$arg0 = this.$name = this.checkArgument(statement.name) || statement.name;
            this.$arg1 = statement.address;
            let cell = MemoryVariables.getCellByValue(MemoryAddress.getCellByValue(this.$arg0)?.name);
            let value = Memory.getCellByAddress(cell.address);
            this.$ret = value;
            this.$stack.push({ address: this.$arg1, value: value });
            this.$route.setPoint(this.$arg0, this.$arg1);
        } else {
            this.$arg0 = this.checkArgument(statement.name);
            this.$stack.push({ value: this.$arg0 });
        }
    }
    
    
    /**
     * The function compilerAddress() takes a statement as an argument and sets the address of the
     * statement to the name of the statement.
     * @param statement - The statement object that is being compiled.
     */
    compilerAddress(statement) {
        this.$arg0 = statement.address;
        this.$arg1 = this.$name = statement.name;
        this.$stack.push({ address: this.$arg0, value: this.$arg1 });
        MemoryAddress.setAddress(this.$arg0, this.$arg1);
        const memory = Memory.getCellByAddress(this.$arg0);
        MemoryVariables.setCell({ name: this.$arg1, address: this.$arg0, memory: memory });
    }
    
    
    /**
     * The function takes a statement, and then pushes the name of the statement to the stack.
     * @param statement - The statement object that is being compiled.
     */
    compilerMemory(statement) {
        this.$arg0 = this.$name = statement.name;
        this.$arg1 = statement.address;
        this.$stack.push({ address: this.$arg1, value: this.$arg0 });
        let set = this.set.filter(cell => cell.name === this.$arg0);
        set['address'] = this.$arg1;
        this.$mem.addCell(this.$arg1, ...set);
    }


    /**
     * It takes a statement object, and pushes it to the set array.
     * @param statement - The statement object that is being compiled.
     */
    compilerSetStatement(statement) {
        this.$arg0 = this.$name = statement.name;
        this.$arg1 = statement.type;
        this.$arg2 = statement.value;
        this.set.push({ name: this.$name, type: this.$arg1, value: this.$arg2 });
    }


    /**
     * The function takes a statement and a usestate object as arguments. The statement object has a
     * state property. The function then sets the usestate object's state property to the value of the
     * statement object's state property
     * @param statement - The statement object that is being compiled.
     * @param usestate - This is the object that is passed to the compiler. It is the object that is
     * used to store the state of the compiler.
     */
    compileIssue(statement, usestate) {
       this.$arg0 = statement.state;
       process.stdout.write(Issues.ISSUES_DEFINE_STATUS);
       statement.state == 'true' ? usestate.state = true : usestate.state = false;
    }


    /**
     * It takes a statement and a type, and then sets the arguments to the statement's arguments
     * @param statement - The statement that is being compiled.
     * @param type - The type of the variable.
     */
    compilerAllArguments(statement, type){
        if (type == 'Int' || type == 'Float') {
            this.$arg0 = +this.checkArgument(statement.args[0]) || +statement.args[0] || 0x00;        
            this.$arg1 = +this.checkArgument(statement.args[1]) || +statement.args[1] || 0x00;
            this.$arg2 = +this.checkArgument(statement.args[2]) ||+statement.args[2] || 0x00;
            this.$arg3 = +this.checkArgument(statement.args[3]) || +statement.args[3] || 0x00;
            this.$arg4 = +this.checkArgument(statement.args[4]) || +statement.args[4] || 0x00;
            this.$arg5 = +this.checkArgument(statement.args[5]) || +statement.args[5] || 0x00;
        } else if (type == 'String') {
            this.$arg0 = this.checkArgument(statement.args[0]) || statement.args[0] || 0x00;
            this.$arg1 = this.checkArgument(statement.args[1]) || statement.args[1] || 0x00;
            this.$arg2 = this.checkArgument(statement.args[2]) || statement.args[2] || 0x00;
            this.$arg3 = this.checkArgument(statement.args[3]) || statement.args[3] || 0x00;
            this.$arg4 = this.checkArgument(statement.args[4]) || statement.args[4] || 0x00;
            this.$arg5 = this.checkArgument(statement.args[5]) || statement.args[5] || 0x00;
        } else if (type == 'Bool') {
            this.$arg0 = Boolean(this.checkArgument(statement.args[0]) || statement.args[0] || 0x00);
            this.$arg1 = Boolean(this.checkArgument(statement.args[1]) || statement.args[1] || 0x00);
            this.$arg2 = Boolean(this.checkArgument(statement.args[2]) || statement.args[2] || 0x00);
            this.$arg3 = Boolean(this.checkArgument(statement.args[3]) || statement.args[3] || 0x00);
            this.$arg4 = Boolean(this.checkArgument(statement.args[4]) || statement.args[4] || 0x00);
            this.$arg5 = Boolean(this.checkArgument(statement.args[5]) || statement.args[5] || 0x00);
        }
    }


    /**
     * If the argument is a register, return the value of that register
     * @param arg - The argument to check.
     * @returns The value of the argument.
     */
    checkArgument(arg) {
        let $al =  this.argsScopeLocal; // $al - arguments in local scope
        let $cl = this.constants; // $cl - constants list
        let $vl = this.set; // $vl - variables list

        /**
         * It checks if the argument passed to it is a valid argument, and if it is, it returns the
         * value of the argument.
         * @param arg - The argument that is being checked.
         * @returns The value of the argument.
         */
        function checkArgumentsUnit(arg) {
            let $edx = 0x00;

            for (const key in $al) {
                if (Object.hasOwnProperty.call($al, key)) {
                    if (new RegExp(`\[${key}\]`).test(arg)) $edx = $al[key];
                }
            }

            return $edx;
        }


        /**
         * It checks if the argument is a variable, and if it is, it returns the value of the variable
         * @param arg - The argument to check.
         * @returns The value of the variable.
         */
        function checkVariable(arg) {
            let $edx = 0x00;
            $vl.forEach(set => set.name == arg ? $edx = set.value : $edx);
            return $edx;
        }

        
        /**
         * If the constant list has the argument, then for each constant in the constant list, if the
         * constant is equal to the argument, then set the edx register to the constant, otherwise set
         * the edx register to the edx register.
         * @param arg - The argument to check if it's a constant.
         * @returns The constant value of the argument.
         */
        function checkConstant(arg) {
            let $edx = 0x00;
            $cl.forEach(constant => constant.name == arg ? $edx = constant.value : $edx);
            return $edx;
        }

        /* Checking if the argument is a variable, constant, or a unit. */  
        if (/\[[_a-zA-Z][_a-zA-Z0-9]{0,30}\]/.test(arg)) return checkArgumentsUnit(arg);
        if (/\[[_a-zA-Z][_a-zA-Z0-9]{0,30}\]/.test(arg)) return checkVariable(arg);
        if (/^[A-Z]+(_[A-Z]+)*$/.test(arg)) return checkConstant(arg);
        // Immutable registers
        if (arg == '$arch') return this.$arch;
        if (arg == '$out') return this.$out;
        // Other
        if (arg == '$offset') return this.$offset;
        if (arg == '$name') return this.$name;
        if (arg == '$math') return this.$math;
        // return
        if (arg == '$ret') return this.$ret;
        if (arg == '$urt') return this.$urt;
        // Stack
        if (arg == '$sp') return this.$sp;
        if (arg == '$lis') return this.$lis;
        if (arg == '$fis') return this.$fis;
        // Execute
        if (arg == '$mov') return this.$mov;
        // jmp counter
        if (arg == '$count') return this.$count;
        // Logical registers
        if (arg == '$eq') return this.$eq;
        if (arg == '$seq') return this.$seq;
        if (arg == '$cmp') return this.$cmp;
        if (arg == '$and') return this.$and;
        if (arg == '$or') return this.$or;
        if (arg == '$xor') return this.$xor;
        if (arg == '$b_and') return this.$b_and;
        if (arg == '$b_or') return this.$b_or;
        // argument registers
        if (arg == '$arg0') return this.$arg0;
        if (arg == '$arg1') return this.$arg1;
        if (arg == '$arg2') return this.$arg2;
        if (arg == '$arg3') return this.$arg3;
        if (arg == '$arg4') return this.$arg4;
        if (arg == '$arg5') return this.$arg5;
    }
}

module.exports = Compiler;