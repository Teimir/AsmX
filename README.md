# AsmX
![](https://komarev.com/ghpvc/?username=E5war5IT&style=flat-square)
<img src='https://komarev.com/ghpvc/?username=E5war5I'/>

# AsmX Academy

# Для кого написана эта книга?

Цель этой книги - как можно быстрее ввести читателя в курс дела, чтобы он начал писать на AsmX работоспособные программы (игры, визуализации данных и вычислительные программы), и одновременно заложить основу в области программирования, которая пригодится ему на протяжении всей жизни. Книга написана для людей любого возраста, которые прежде никогда не программировали на AsmX или вообще никогда не программировали. Если вы хотите быстро изучить азы программирования, чтобы сосредоточиться на интересных проектах, а также проверить свое понимание новых концепций на содержательных задачах, - эта книга для вас.

# **Онлайн ресурсы**

- **Обновления.** AsmX, как и все языки постоянно развивается. Сам язык программирования AsmX можно посмотреть тут
- Расширение для подсветки AsmX кода [extension](https://marketplace.visualstudio.com/items?itemName=AsmX.AsmX) (VS Code)
- Сайт документации по AsmX [web site](https://langprogramming-asmx.github.io/AsmX-Documentation/)

# **Часть I** Основы

# Глава 1. Первые шаги

В этой главе вы запустите свою первую программу на языке AsmX, hello_world.asmX. Сначала вы проверите, установлен AsmX на вашем компьютере, и если нет - установите его.

В части I этой книги представлены базовые концепции, необходимые для написания программ на языке AsmX. Многие из этих концепций встречаются во всех языках программирования, поэтому они пригодятся вам на протяжении всей карьеры в программировании.

В главе I вы установите AsmX на свой компьютер и запустите свою первую программу, которая выводит на экран сообщение *Hello World!*

## Установка AsmX

В первую очередь нам нужно установить необходимые ресурсы конечно же))

У вас должен быть NodeJS v16.15.1 версии, npm версии 8.11.0. Ну и git. (У меня стоит 2.36.1 версия git).
```sh
git clone https://github.com/langprogramming-AsmX/AsmX.git
npm install
```
После этого уже запускаем ядро:
```sh
node kernel.js
```
После чего у нас попросят путь к файлу, если вести файл другого расширения, у нас выдаст ошибку. После указания пути к самому ядру мы можем сразу указать путь к .asmX файлу. В противном случае появится CLI (Command Line Interface) который попросит путь к файлу.

> При выходе AsmX v3, его можно запустить на NodeJS v18.16.1 (LTS)

> Если у вас установлен AsmX третьей версии (AsmX v3) или более поздней версии, для запуска AsmX кода из терминала восполлзуйтесть при вызове яздра дать следующий параметр **repl**, как показано в примере:
> ```
> node kernel.js repl
> ```
> REPL - Read Eval Print Loop

## Установка VS Code

Программу установки VS Code можно загрузить по адресу https://code.visualstudio.com/. Щелкните на ссылке загрузки и найдите программу установки для Windows. После того как программа установки будет загружена, запустите её и подтвердите все настройки по умолчанию.

## Запуск программы Hello World

После того как в вашей системе будут установлены последние версии AsmX и VS Code, всё почти готово к запуску вашей первой программы на AsmX, написанной в текстовом редакторе. После этого вы сможете написать программу *Hello World!* и запустить её.

## Запуск hello_world.asmX

Прежде чем писать программу, создайте где-нибудь в свей системе папку с именем *AsmX_workspace* для своих проектов.

Откройте VS Code и сохраните пустой файл AsmX (**File -> Save As**) с именем *hello_world.asmX* в папке *AsmX_workspace.*После того как файл будет сохранен, введите следующую строку в текстовом редакторе:
```asmX
@call print("Hello world!");
```
## Запуск AsmX в терминале

Большинство программ, написанных вами в текстовом редакторе, будут запускаться прямо из редактора. Тем не менее иногда бывает полезно запускать программы из терминала - например, если вы хотите просто выполнить готовую программу, не открывая её для редактирования.

Это можно сделать в любой системе с установленной поддержкой AsmX; необходимо лишь знать путь к каталогу, в котором хранится файл программы. Приведенные ниже примеры предполагают, что вы сохранили файл *hello_world.asmX*в папке *AsmX_workspace н*а рабочем столе.

## В Windows

Команда *cd* (Change Directory) используется для перемещения по файловой системе в окне командной строки. Команда *dir* (DIRectory) выводит список всех файлов в текущем каталоге.

Откройте новое терминальное окно и введите следующие команды для запуска программы *hello_world.asmX*:
```sh
C:\ > cd Desktop/AsmX_workspace
C:\Desktop\AsmX_workspace> dir
hello_world.asmX
C:\Desktop\AsmX_workspace> node asmx/kernel.js hello_world.asmX
Hello world!
```
Команда *cd* используется для перехода к папке *asmX_workspace,* находящейся в папке *Desktop*. Затем команда *dir* проверяет, что файл hello_world.asmX действительно находится в этой папке. Далее файл запускается командой node asmx/kernel.js hello_world.asmX. Где asmx это папка скачанного AsmX с GitHub.

Большинство программ будет нормально запускаться из редактора. Но со временем ваша работа станет более сложной, и возможно, вы предпочтете запускать некоторые из своих программ из терминала.


## В macOS и Linux

Запуск программы AsmX в терминальном сеансе в системах Linux и macOS осуществляется одинаково. Команда *cd* (Change Directory) используется для перемещения по файловой системе в терминальном сеансе. Команда *Is* (LiSt) выводит список всех нескрытых файлов в текущем каталоге.

Откройте новое терминальное окно и введите следующие команды для запуска программы hello_world.asmX:
```
\~$ cd Desktop/AsmX_worspace/
\~Desktop/AsmX_worspace/$ ls
  hello_world.asmX
\~Desktop/AsmX_worspace/$ node asmx/kernel.js hello_world.asmX
Hello world!
```
Команда *cd* используется для перехода к папке *asmX_workspace,* находящейся в папке *Desktop*. Затем команда *ls* проверяет, что файл hello_world.asmX действительно находится в этой папке. Далее файл запускается командой node asmx/kernel.js hello_world.asmX. Где asmx это папка скачанного AsmX с GitHub.

## Решение проблем с установкой

Если вам так и не удалось запустить программу *hello_world.asmX,* возможно, вам помогут следующие полезные советы (кстати, они могут пригодиться для решения любых проблем в программах).

- Если программа содержит серьезную ошибку, AsmX выводит данные трассировки. AsmX анализирует содержимое файла и пытается составить отчет о проблеме. Возможно, трассировка подскажет, что именно мешает выполнению программы.
- Отойдите от компьютера, отдохните и попробуйте снова. Помните, что синтаксис в программировании очень важен; даже пропущенное двоеточие, неверно расположенная кавычка или непарная скобка могут помешать нормальной работе программы. Перечитайте соответствующие части главы, еще раз проанализируйте, что было сделано, и попробуйте найти ошибку.
- Начните заново. Вероятно, ничего переустанавливать не придется, но попробуйте удалить файл *hello_world.asmX* и создать его с нуля.
- Попросите кого-нибудь повторить действия, описанные в этой главе, на вашем (или на другом) компьютере. Внимательно понаблюдайте за происходящим. Возможно, вы упустили какую-нибудь мелочь, которую заметят другие.
- Найдите специалиста, хорошо знающего AsmX, и попросите его помочь вам.Вполне может оказаться, что такой специалист есть среди ваших знакомых.
- Обратитесь за помощью в интернет. В приложении В перечислены некоторые ресурсы (форумы, чаты и т. д.), на которых вы сможете проконсультироваться у людей, уже сталкивавшихся с вашей проблемой.

Не стесняйтесь обращаться к опытным программистам. Любой программист в какой-то момент своей жизни заходил в тупик; многие программисты охотно помогут вам правильно настроить вашу систему. Если вы сможете четко объяснить, что вы хотите сделать, что уже пытались и какие результаты получили, скорее всего, кто-нибудь вам поможет. Как упоминалось во введении, сообщество AsmX доброжелательно относится к новичкам.

AsmX должен нормально работать на любом современном компьютере, и если у вас все же возникли проблемы - обращайтесь за помощью. На первых порах проблемы могут быть весьма неприятными, но с ними стоит разобраться. Когда программа hello_world.asmX заработает, вы сможете приступить к изучению AsmX, а ваша работа станет намного более интересной и принесет больше удовольствия.

**Упражнения**

1. Опечатки в Hello World: откройте только что созданный файл *hello_world.asmX*. Сделайте где-нибудь намеренную опечатку и снова запустите программу. Удастся ли вам сделать опечатку, которая приводит к ошибке? Поймете ли вы смысл сообщения об ошибке? Удастся ли вам сделать опечатку, которая не приводит к ошибке? Как вы думаете, почему на этот раз выполнение обходится без ошибки?
2. Бесконечное мастерство: если бы вы были программистом с неограниченными возможностями, за какой проект вы бы взялись? Вы сейчас учитесь программировать. Если у вас имеется ясное представление о конечной цели, вы сможете немедленно применить свои новые навыки на практике; Попробуйте набросать общие описания тех программ, над которыми вам хотелось бы поработать. Заведите «блокнот идей», к которому вы сможете обращаться каждый раз, когда собираетесь начать новый проект. Выделите пару минут и составьте описания трех программ, которые вам хотелось бы создать.

## Итоги

В этой главе вы познакомились с языком AsmX и установили поддержку AsmX в своей системе, если она не была установлена ранее. Также вы установили текстовый редактор, упрощающий работу над кодом AsmX. Вы научились выполнять фрагменты кода AsmX в терминальном сеансе и запустили свою первую настоящую программу *hello_world.asmX*. Скорее всего, попутно вы кое-что узнали о поиске и исправлении ошибок.

В следующей главе рассматриваются структуры данных, с которыми вы будете работать в программах AsmX. Кроме того, вы научитесь пользоваться переменными AsmX.

# Глава 2. Переменные и простые типы данных

В этой главе представлены разные виды данных, с которыми вы будете работать в своих программах AsmX. Вы также научитесь использовать переменные для представления данных в своих программах.

## Что происходит при запуске hello_world.asmX

Давайте повнимательнее разберемся с тем, что же делает AsmX при запуске *hello_world.asmX*. Оказывается, даже для такой простой программы AsmX выполняет серьезную работу:

**hello_world.asmX**:
```asmX
@call print("Hello world!");
```
При выполнении этого кода выводится следущий текст:
```
Hello world!
```
Суффикс .asmX в имени файла *hello_world.asmX* указывает, что файл является программой AsmX.

## Переменные

Попробуем использовать переменную в программе *hello_world.asmX*. Добавьте новую строку в начало файла и измените вторую строку:

**hello_world.asmX**
```asmX
@set message String "Hello world!";
@call print(set::message);
```
Запустите программу и посмотрите, что получится. Программа выводит уже знакомый результат:
```
Hello world!
```
В программу добавилась *переменная* с именем **message**. В каждой переменной хранится *значение*, то есть данные, связанные с переменной. В нашем случае значением является текст **"Hello world!"**.

Добавление переменной немного усложняет задачу AsmX. Во время обработки первой строки он связывает текст **"Hello world!"** с переменной **message**. А когда AsmX доберется до второй строки, он выводит на экран значение, связанное с именем **message**.

Давайте немного расширим эту программу *hello_world.asmX*, чтобы она выводила второе сообщение. Добавьте в *hello_world.asmX*, ещё строку которая выводит другое сообщение.

```
@set message String "Hello world!";
@call print(set::message);
@call print("Hello AsmX Crash Course world!");
```

Теперь при выполнении *hello_world.asmX* на экране должны появляться две строки:
```
Hello world!
Hello AsmX Crash Course world!
```

> Вы можете в любой момент изменить значение переменной в своей программе. AsmX постоянно отслеживает его текущее состояние.

## Выбор имен и использование переменных

При работе с переменными в языке AsmX необходимо соблюдать некоторые правила и рекомендации. Нарушение правил приведет к ошибке, рекомендации всего лишь помогают писать более понятный и удобночитаемый код.

  - Имена переменных могут состоять только из букв, цифр и символов подчеркивания. Они могут начинаться с буквы или символа подчеркивания, но не с цифры. Например, переменной можно присвоить имя *message_1*, но не с *1_message*.
 - Пробелы в именах переменных запрещены, а для разделения слов в именах переменных используются символы подчеркивания. Например имя **first_message** допустимо, а имя **first message** вызовёт ошибку.
  - Будьте внимательны при использовании строчной буквы l и прописной буквы o, потому что они похожи на цифры 1 и 0.

Вы не сразу научитесь создавать хорошие имена переменным, особенно когда ваши программы станут сложнее и интересными.

>  Примечание - Пока ограничитесь именами переменных, записанными в нижнем регистре.

## Рекомендации (для AsmX v3)
Если вы только изучаете AsmX, можете пропустить этот пункт, так как этот раздел полезен, тем кто знает AsmX базу или скачал AsmX v3 или боле позднюю версию. Вы можете вернуться к этому разделу когда наберётесь опыта по программированию AsmX.

 - если вы создаёте переменную в AsmX v3, вы можете создавать переменную и с помощью `@mut` (название инструкции было сокращено от английского слова **mutable** (изменчивый, изменяемый)).
 - Если вы опытный программист и знаете что такое константы, и как их в AsmX создавать, то вместо `@define` можно использовать `@immut`.
 - Вместо `@set` и.`@define` вы можете использовать стиль написания `@mut` / `@immut` (**mutable / immutable**).

## Практические задания
- Попробуйте изменить в *hello_world.asmX* в программе *"Hello world!"* на свой текст. Перед этим не забудьте измененный текст поставить в кавычки.

## Строки

Так как многие программы определяют и собирают некие данные, а затем делают с ними что-то полезное, желательно выделить основные разновидности данных. Начнем со строковых данных. На первый взгляд строки достаточно просты, но с ними можно работать многими разными способами.

Строки из себя представляют последовательность символов, заключенных в кавычки. Можно заключать их в одинарнные или в двойные кавычки:
```
"String"
'String'
```

### Табуляция и разрывы строк
Существует термин *whitespace* который обозначает: напечатанные символы, как пробелы, табуляции и символы конца строки.

Для включения в текст позиции табуляции используется комбинация символов **\t**, как показано в примере ниже:
```
@call print('AsmX')
AsmX

@call print('\tAsmX')
  AsmX
```

Список whitespace:

| code |          name          |
|------|------------------------|
|  \t  |    Line tabulation     |
|  \n  |    Line feed (LF)      |
|  \r  |    from feed (FF)      |
|  \f  |  carriage return (CR)  |

## Числа

В программировании существуют числа которые часто используются в программах для вычислений, вывода счёта игры, представления визуальных данных. В AsmX существуют нессколько числовых данных, для нача осмотрм, как AsmX работает с целыми числами, потому что с ними возникает меньше проблем.


### Целые числа (int)
В AsmX с целыми числами можно выполнять операции сложения, вычитания, умножения и деления.
```
@add 9 9
@sub 10 5
@mul 10 2
@div 45 9
```

>  @add (add- addition) - сложение чисел <br>
>  @sub (sub - substraction) - вычитание чисел <br>
>  @mul (mul - multiplication) - умножение чисел <br>
>  @div (div - division) - деление чисел

Результаты:
```
18
5
20
5
```

Для вывода результата какого то действия вычисления нужно написать:
```
@call print($ret);
```

### Числа с плавающей точкой (float)

В AsmX числа, имеющие дробную часть, назваются *числа с плавающей точкой*. Обычно разработчки могут просто пользоваться дробными значениями.
```
@add 9.8 9.2
```

Результаты:
```
19
```

### Символы подчеркивания в числах
В записи целых чисел можно групировать цифры при помощи символов подчеркивания, чтобы числа лучше читались:
```
@add 10_000 78;
@call print(10078); # 10_000 -> 10000
```

C точки зрения AsmX **1000** ничем не отличается от записи **10_00**. Этот вариант записи работает как для целых чисел в AsmX третьей версии и позднее.

## Константы

*Константа* представляет собой переменную, значение которой остаётся неизменным. В AsmX имена констант принято записывать в верхнем регистре:
```
@define MIN_SCORE 100
```

## Комментарии

Комментарии чрезвычайно полезны в любой программе, любом языке программирования. По мере роста объёма и сложности программы следует добавлять *комментарии*, описывающие действия программы, или суть реализации. Их также можно использовать своего рода заметки, написанные на понятном языке.

### Как создаются комментарии
В языке AsmX признаком комментария является символ решётки (**#**). ASmX игнорирует все символы, начинающиеся с символа **#** до конца строки. 
Пример:
```
# Say hello to everyone.
@call print("Hello AsmX people!");
```
AsmX игнорирует первую строку и выполняет вторую:
```
Hello AsmX people!
```

### Какие комментарии следует писать

Главная задача комменатрия - объяснить, что должен делать ваш код и как он работает. В разгаре работы над проектом вы понимаете, как работают все его компоненты. Но если вернуться к проекту через некоторое время, сокрее всего, вы забудете как работает программа. Конечно, всегда можно изучить код и разобраться, в том как программа работает, но хорошие коментарии дадут вам сэкономить время на чтение программы.

**Упражнения**

1. **Добавление комментариев**: выберите две программы из написанных вами и добавьте ы каждую хотя бы один комментарий. Если вы не найдете, что написать в комментариях, потому что программы были слишком просты, добавьте своё имя и текущую дату в начало кода. Затем одно предложение с описанием того что делает программа.

## Итоги

- В этой главе вы научились работать с переменными. 
- Вы узнали как использовать содержательные имена переменных и как исправлять ошибки в именах. 
- Вы узнали что такое строки, как выводить их. Мы рассмотрели способы аккуратного оформления вывода с применением пропусков.
- Вы начали работать с целыми и числами с плавающей точкой. 
- Вы научились писать комментарии для программы AsmX.


# Глава 3.
# Глава 4.
# Глава 5.