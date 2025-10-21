// Cargar datos de localStorage
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
let movements = JSON.parse(localStorage.getItem('movements')) || [];

// Actualizar tabla de inventario
function updateInventoryTable() {
    const tableBody = document.getElementById('inventory-table');
    tableBody.innerHTML = '';
    inventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = item.quantity <= item.minStock ? 'bg-red-100' : '';
        row.innerHTML = `
            <td class="p-2">${item.name}</td>
            <td class="p-2">${item.quantity}</td>
            <td class="p-2">${item.unit}</td>
            <td class="p-2">${item.minStock}</td>
            <td class="p-2">
                <button onclick="editItem(${index})" class="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600">Editar</button>
                <button onclick="deleteItem(${index})" class="bg-red-500 text-white p-1 rounded hover:bg-red-600">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    updateMovementSelect();
    saveData();
}

// Actualizar selector de movimientos
function updateMovementSelect() {
    const select = document.getElementById('movement-item');
    select.innerHTML = '<option value="">Seleccionar insumo</option>';
    inventory.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = `${item.name} (${item.unit})`;
        select.appendChild(option);
    });
}

// Actualizar tabla de movimientos
function updateMovementTable() {
    const tableBody = document.getElementById('movement-table');
    tableBody.innerHTML = '';
    movements.forEach(movement => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-2">${movement.date}</td>
            <td class="p-2">${movement.item}</td>
            <td class="p-2">${movement.type}</td>
            <td class="p-2">${movement.quantity}</td>
            <td class="p-2">${movement.unit}</td>
            <td class="p-2">${movement.reason}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Guardar datos en localStorage
function saveData() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('movements', JSON.stringify(movements));
}

// Añadir o editar insumo
document.getElementById('inventory-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('item-name').value;
    const quantity = parseInt(document.getElementById('item-quantity').value);
    const unit = document.getElementById('item-unit').value;
    const minStock = parseInt(document.getElementById('item-min').value);

    if (name && quantity >= 0 && unit && minStock >= 0) {
        const existingItem = inventory.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity = quantity;
            existingItem.unit = unit;
            existingItem.minStock = minStock;
        } else {
            inventory.push({ name, quantity, unit, minStock });
        }
        updateInventoryTable();
        this.reset();
    } else {
        alert('Por favor, completa todos los campos correctamente.');
    }
});

// Registrar movimiento
document.getElementById('movement-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const itemName = document.getElementById('movement-item').value;
    const type = document.getElementById('movement-type').value;
    const quantity = parseInt(document.getElementById('movement-quantity').value);
    const reason = document.getElementById('movement-reason').value;

    if (itemName && quantity > 0 && reason) {
        const item = inventory.find(i => i.name === itemName);
        if (type === 'salida' && item.quantity < quantity) {
            alert('No hay suficiente stock para esta salida.');
            return;
        }

        item.quantity += type === 'entrada' ? quantity : -quantity;
        movements.push({
            date: new Date().toLocaleString(),
            item: itemName,
            type: type.charAt(0).toUpperCase() + type.slice(1),
            quantity,
            unit: item.unit,
            reason
        });

        updateInventoryTable();
        updateMovementTable();
        this.reset();
    } else {
        alert('Por favor, completa todos los campos correctamente.');
    }
});

// Eliminar insumo
function deleteItem(index) {
    if (confirm('¿Estás seguro de eliminar este insumo?')) {
        inventory.splice(index, 1);
        updateInventoryTable();
    }
}

// Editar insumo
function editItem(index) {
    const item = inventory[index];
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-quantity').value = item.quantity;
    document.getElementById('item-unit').value = item.unit;
    document.getElementById('item-min').value = item.minStock;
}

// Inicializar tablas
updateInventoryTable();
updateMovementTable();