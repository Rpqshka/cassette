function addCassette() {
    var cassetteCount = document.querySelectorAll(".cassette-grid .cassette").length;
    if (cassetteCount >= 8) {
        alert("Достигнуто максимальное количество кассет (8) на странице.");
        return;
    }

    var existingCassette = document.querySelector(".cassette");
    var newCassetteDiv = existingCassette.cloneNode(true);

    newCassetteDiv.classList.remove('selected');
    var cassetteImg = newCassetteDiv.querySelector("img");
    cassetteImg.src = "./img/" + (cassetteCount + 1) + ".png";

    var cassetteContainer = document.querySelector(".cassette-grid");
    cassetteContainer.appendChild(newCassetteDiv);

    var settingsIcon = newCassetteDiv.querySelector('.settings-icon');
    settingsIcon.addEventListener('click', function() {
    });
}

function removeCassette() {
    var cassetteCount = document.querySelectorAll(".cassette-grid .cassette").length;
    if (cassetteCount <= 1) {
        alert("На странице должна быть как минимум одна кассета.");
        return;
    }

    var lastCassette = document.querySelector(".cassette-grid .cassette:last-child");
    lastCassette.parentNode.removeChild(lastCassette);
}

function showSettings(element) {
    document.querySelectorAll('.settings').forEach(function(settings) {
        settings.style.display = 'none';
    });
    var container = element.closest('.container');

    if (container) {
        var settingsBlock = container.querySelector('.settings');
        if (settingsBlock) {
            settingsBlock.style.display = 'block';
            var cassette = element.closest('.cassette');
            document.querySelectorAll('.cassette').forEach(function(cassette) {
                cassette.classList.remove('selected');
            });
            cassette.classList.add('selected');
        }
    }
}

function saveSettings() {
    var selectedCassette = document.querySelector('.cassette.selected');
    if (!selectedCassette) {
        console.error('Не выбрана кассета для сохранения настроек.');
        return;
    }

    var title = document.querySelector('.settings-cassette-title-input').value.trim();
    var status = document.querySelector('.settings-cassette-status-select').value;
    var value = document.querySelector('.settings-cassette-value-select').value;
    var quantity = document.querySelector('.settings-cassette-quantity-input').value;

    if (title == ""){
        title = "Название кассеты";
    }
    
    if (quantity == ""){
        quantity = 0;
    }
    
    console.log(quantity)
    selectedCassette.querySelector('.cassette-title').innerText = title;
    selectedCassette.querySelector('.cassette-status').innerText = 'Статус: ' + status;
    selectedCassette.querySelector('.cassette-value').innerText = 'Номинал: ' + value;
    selectedCassette.querySelector('.cassette-quantity').innerText = 'Количество: ' + quantity;

    selectedCassette.classList.remove('selected');
    document.querySelector('.settings').style.display = 'none';
}


function exchange() {
    var startTime = new Date().getTime();

    var amount = document.querySelector('.exchange-input').value;

    if (isNaN(amount) || amount <= 0) {
        alert("Введите корректную сумму в рублях.");
        return;
    }

    var cassettes = document.querySelectorAll('.cassette');
    var cassetteData = [];

    cassettes.forEach(function(cassette) {
        var status = cassette.querySelector('.cassette-status').innerText.split(':')[1].trim();
        if (status === 'исправна') {
            var value = parseInt(cassette.querySelector('.cassette-value').innerText.split(':')[1].trim());
            var quantity = parseInt(cassette.querySelector('.cassette-quantity').innerText.split(':')[1].trim());
            cassetteData.push({ element: cassette, value: value, quantity: quantity });
        }
    });

    var totalAvailable = 0;
    var requiredCassettes = [];

    cassetteData.sort(function(a, b) {
        return b.value - a.value;
    });

    for (var i = 0; i < cassetteData.length; i++) {
        var currentValue = cassetteData[i].value;
        var currentQuantity = cassetteData[i].quantity;

        while (currentQuantity > 0 && totalAvailable + currentValue <= amount) {
            totalAvailable += currentValue;
            currentQuantity--;
            requiredCassettes.push(currentValue);
        }

        cassetteData[i].element.querySelector('.cassette-quantity').innerText = 'Количество: ' + currentQuantity;
    }

    var endTime = new Date().getTime();
    var duration = endTime - startTime;

    if (totalAvailable < amount) {
        alert("Невозможно выдать указанную сумму.");
        return;
    }

    var result = {};
    requiredCassettes.forEach(function(c) {
        if (!result[c]) {
            result[c] = 0;
        }
        result[c]++;
    });

    var output = "Для выдачи суммы " + amount + " рублей необходимо:\n";
    for (var key in result) {
        output += result[key] + " кассет номиналом " + key + " рублей\n";
    }

    output += "Время вычисления: " + duration + " мс";

    alert(output);
}
