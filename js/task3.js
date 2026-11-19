// isValidBrackets: проверка правильности скобочной последовательности
function isValidBrackets(s) {
    var matching = { ')': '(', ']': '[', '}': '{' };
    var opening = new Set(['(', '[', '{']);
    var stack = [];

    for (var i = 0; i < s.length; i++) {
        var char = s[i];
        if (opening.has(char)) {
            stack.push(char);
        } else if (char in matching) {
            if (stack.length === 0 || stack[stack.length - 1] !== matching[char]) {
                return false;
            }
            stack.pop();
        }
    }

    return stack.length === 0;
}

// Интерактивная проверка
document.getElementById('check-btn').addEventListener('click', function () {
    var input = document.getElementById('bracket-input').value;
    var resultEl = document.getElementById('check-result');
    var stackEl = document.getElementById('stack-visual');

    var valid = isValidBrackets(input);

    resultEl.textContent = valid
        ? 'true, последовательность правильная'
        : 'false, последовательность неправильная';
    resultEl.className = 'result ' + (valid ? 'valid' : 'invalid');

    // Визуализация стека
    var matching = { ')': '(', ']': '[', '}': '{' };
    var opening = new Set(['(', '[', '{']);
    var stack = [];
    var errorIndex = -1;

    for (var i = 0; i < input.length; i++) {
        var char = input[i];
        if (opening.has(char)) {
            stack.push(char);
        } else if (char in matching) {
            if (stack.length === 0 || stack[stack.length - 1] !== matching[char]) {
                errorIndex = i;
                break;
            }
            stack.pop();
        }
    }

    if (stack.length === 0 && errorIndex === -1) {
        stackEl.innerHTML = '<span style="color:#78716c;font-style:italic;">Стек пуст</span>';
    } else {
        stackEl.innerHTML = stack.map(function (c) {
            return '<div class="stack-item">' + c + '</div>';
        }).join('');
    }
});

// Enter тоже запускает проверку
document.getElementById('bracket-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('check-btn').click();
    }
});

// Тесты
document.getElementById('run-tests').addEventListener('click', function () {
    var output = document.getElementById('test-output');
    var results = [];

    function assert(actual, expected, name) {
        if (actual === expected) {
            results.push('<span class="pass">  PASS</span>  ' + name + '  :  ' + actual);
        } else {
            results.push('<span class="fail">  FAIL</span>  ' + name + '  :  ожидалось ' + expected + ', получено ' + actual);
        }
    }

    assert(isValidBrackets('()'),     true,  '"()"');
    assert(isValidBrackets('()[]{}'), true,  '"()[]{}"');
    assert(isValidBrackets('(]'),     false, '"(]"');
    assert(isValidBrackets('([)]'),   false, '"([)]"');
    assert(isValidBrackets('{[]}'),   true,  '"{[]}"');

    assert(isValidBrackets(''),       true,  'Пустая строка');
    assert(isValidBrackets('('),      false, 'Одна открывающая');
    assert(isValidBrackets(')'),      false, 'Одна закрывающая');
    assert(isValidBrackets('((()))'), true,  'Глубокая вложенность "(((())))"');
    assert(isValidBrackets('{[({})[]]}'), true, 'Сложная вложенность "{[({})[]]}');
    assert(isValidBrackets('({[}])'), false, 'Неправильный порядок "({[}])"');
    assert(isValidBrackets('((({{{[[[]]]}}})))'), true, '18 вложенных скобок');

    var big = '('.repeat(5000) + ')'.repeat(5000);
    var t0 = performance.now();
    var bigResult = isValidBrackets(big);
    var t1 = performance.now();
    assert(bigResult, true, '10 000 символов (' + (t1 - t0).toFixed(2) + ' мс)');

    output.innerHTML = '<strong>Результаты тестирования:</strong>\n\n' + results.join('\n');
});
