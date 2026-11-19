// deepClone: глубокое копирование объекта
function deepClone(source, seen = new WeakMap()) {
    // 1. Примитивы и null
    if (source === null || (typeof source !== 'object' && typeof source !== 'function')) {
        return source;
    }

    // 2. Функции
    if (typeof source === 'function') {
        const clonedFn = source.bind({});
        Object.defineProperties(clonedFn, Object.getOwnPropertyDescriptors(source));
        return clonedFn;
    }

    // 3. Циклические ссылки
    if (seen.has(source)) {
        return seen.get(source);
    }

    // 4. Date
    if (source instanceof Date) {
        return new Date(source.getTime());
    }

    // 5. RegExp
    if (source instanceof RegExp) {
        return new RegExp(source.source, source.flags);
    }

    // 6. Map
    if (source instanceof Map) {
        const mapCopy = new Map();
        seen.set(source, mapCopy);
        source.forEach((val, key) => {
            mapCopy.set(deepClone(key, seen), deepClone(val, seen));
        });
        return mapCopy;
    }

    // 7. Set
    if (source instanceof Set) {
        const setCopy = new Set();
        seen.set(source, setCopy);
        source.forEach((val) => {
            setCopy.add(deepClone(val, seen));
        });
        return setCopy;
    }

    // 8. Array и Object: сохраняем прототип
    const proto = Object.getPrototypeOf(source);
    const clone = Array.isArray(source) ? [] : Object.create(proto);

    seen.set(source, clone);

    // 9. Копируем все собственные свойства (включая символьные)
    const keys = [
        ...Object.getOwnPropertyNames(source),
        ...Object.getOwnPropertySymbols(source)
    ];

    for (const key of keys) {
        const descriptor = Object.getOwnPropertyDescriptor(source, key);
        if (descriptor.value !== undefined) {
            descriptor.value = deepClone(descriptor.value, seen);
        }
        Object.defineProperty(clone, key, descriptor);
    }

    return clone;
}

// Тесты
document.getElementById('run-tests').addEventListener('click', function () {
    var output = document.getElementById('test-output');
    var results = [];

    function assert(condition, name) {
        if (condition) {
            results.push('<span class="pass">  PASS</span>  ' + name);
        } else {
            results.push('<span class="fail">  FAIL</span>  ' + name);
        }
    }

    var obj1 = { a: 1, b: { c: 2, d: { e: 3 } } };
    var copy1 = deepClone(obj1);
    copy1.b.d.e = 999;
    assert(obj1.b.d.e === 3, 'Вложенные объекты: изменение копии не влияет на оригинал');

    var obj2 = { arr: [1, [2, 3], { x: 4 }] };
    var copy2 = deepClone(obj2);
    copy2.arr[1][0] = 999;
    assert(obj2.arr[1][0] === 2, 'Вложенные массивы: независимая копия');

    var obj3 = { date: new Date('2024-01-15') };
    var copy3 = deepClone(obj3);
    copy3.date.setFullYear(1999);
    assert(obj3.date.getFullYear() === 2024, 'Date: независимая копия');

    var obj4 = { map: new Map([['key1', { val: 1 }]]) };
    var copy4 = deepClone(obj4);
    copy4.map.get('key1').val = 999;
    assert(obj4.map.get('key1').val === 1, 'Map: глубокая копия значений');

    var inner = { x: 1 };
    var obj5 = { set: new Set([inner]) };
    var copy5 = deepClone(obj5);
    assert(![...copy5.set].includes(inner), 'Set: элементы скопированы, а не те же ссылки');

    var obj6 = { a: 1 };
    obj6.self = obj6;
    var cyclePassed = false;
    try {
        var copy6 = deepClone(obj6);
        cyclePassed = copy6.self === copy6 && copy6 !== obj6;
    } catch (e) {
        cyclePassed = false;
    }
    assert(cyclePassed, 'Циклические ссылки: корректная обработка без рекурсии');

    var sym = Symbol('test');
    var obj7 = { [sym]: 'символ', normal: 'обычный' };
    var copy7 = deepClone(obj7);
    assert(copy7[sym] === 'символ', 'Символьные ключи: скопированы');

    var obj8 = { fn: function(x) { return x * 2; }, a: 1 };
    var copy8 = deepClone(obj8);
    assert(typeof copy8.fn === 'function' && copy8.fn(5) === 10, 'Функции: скопированы и работают');

    function Animal(name) { this.name = name; }
    Animal.prototype.speak = function() { return this.name; };
    var obj9 = new Animal('Кот');
    var copy9 = deepClone(obj9);
    assert(Object.getPrototypeOf(copy9) === Animal.prototype, 'Прототип: сохранён');
    assert(copy9.speak() === 'Кот', 'Прототип: методы доступны');

    var obj10 = { regex: /hello\d+/gi };
    var copy10 = deepClone(obj10);
    assert(copy10.regex.source === 'hello\\d+' && copy10.regex.flags === 'gi', 'RegExp: скопирован корректно');
    assert(copy10.regex !== obj10.regex, 'RegExp: новый экземпляр');

    assert(deepClone(42) === 42, 'Примитив число: возвращается как есть');
    assert(deepClone('строка') === 'строка', 'Примитив строка: возвращается как есть');
    assert(deepClone(null) === null, 'null: возвращается как есть');
    assert(deepClone(undefined) === undefined, 'undefined: возвращается как есть');

    output.innerHTML = '<strong>Результаты тестирования:</strong>\n\n' + results.join('\n');
});
