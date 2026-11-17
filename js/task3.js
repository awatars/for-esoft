//Реализация
function isValidBrackets(s) {
    const matching = { ')': '(', ']': '[', '}': '{' };
    const opening = new Set(['(', '[', '{']);
    const stack = [];

    for (const char of s) {
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

//Интерактивная проверка
document.getElementById('check-btn').addEventListener('click', () => {
    const input = document.getElementById('bracket-input').value;
    const resultEl = document.getElementById('check-result');
    const stackEl = document.getElementById('stack-visual');

    const valid = isValidBrackets(input);

    resultEl.textContent = valid
        ? `true — последовательность правильная`
        : `false — последовательность неправильная`;
    resultEl.className = 'result ' + (valid ? 'valid' : 'invalid');

    const matching = { ')': '(', ']': '[', '}': '{' };
    const opening = new Set(['(', '[', '{']);
    const stack = [];
    let errorIndex = -1;

    for (let i = 0; i < input.length; i++) {
        const char = input[i];
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
        stackEl.innerHTML = '<span style="color:#5c6370;font-style:italic;">Стек пуст ✓</span>';
    } else {
        stackEl.innerHTML = stack.map(c => `<div class="stack-item">${c}</div>`).join('');
    }
});

// Enter тоже запускает проверку
document.getElementById('bracket-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('check-btn').click();
});

//Тесты 
document.getElementById('run-tests').addEventListener('click', () => {
    const output = document.getElementById('test-output');
    const results = [];

    function assert(actual, expected, name) {
        if (actual === expected) {
            results.push(`<span class="pass">   PASS</span>  ${name}  →  ${actual}`);
        } else {
            results.push(`<span class="fail">   FAIL</span>  ${name}  →  ожидалось ${expected}, получено ${actual}`);
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

    const big = '('.repeat(5000) + ')'.repeat(5000);
    const t0 = performance.now();
    const bigResult = isValidBrackets(big);
    const t1 = performance.now();
    assert(bigResult, true, `10 000 символов (${(t1 - t0).toFixed(2)} мс)`);

    output.innerHTML = `<strong>Результаты тестирования:</strong>\n\n${results.join('\n')}`;
});
