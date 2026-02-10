// Equipment pricing data
const EQUIPMENT = {
    'mini-excavator': { name: 'Mini Excavator (Cat 301.7 CR)', daily: 250, weekly: 1000, deposit: 1000 },
    'skid-steer': { name: 'Skid Steer (2TS/215)', daily: 280, weekly: 1120, deposit: 800 },
    'dump-trailer': { name: 'Dump Trailer (6x12)', daily: 100, weekly: 400, deposit: 500 }
};

const ADDONS = {
    'bucket-12': { name: '12" Bucket', daily: 30, weekly: 120 },
    'bucket-18': { name: '18" Bucket', daily: 35, weekly: 140 },
    'bucket-24': { name: '24" Bucket', daily: 45, weekly: 180 }
};

// Load all session data
const selectedEquipment = sessionStorage.getItem('selectedEquipment');
const selectedAddons = JSON.parse(sessionStorage.getItem('selectedAddons') || '[]');
const startDate = sessionStorage.getItem('startDate');
const endDate = sessionStorage.getItem('endDate');
const rentalDays = parseInt(sessionStorage.getItem('rentalDays') || '0');
const pickupTime = sessionStorage.getItem('pickupTime');
let equipmentCost = parseInt(sessionStorage.getItem('equipmentCost') || '0');
let addonsCost = parseInt(sessionStorage.getItem('addonsCost') || '0');
let subtotal = parseInt(sessionStorage.getItem('subtotal') || '0');
const needsDelivery = sessionStorage.getItem('needsDelivery') === 'true';
const deliveryFee = parseFloat(sessionStorage.getItem('deliveryFee') || '0');
const deliveryAddress = JSON.parse(sessionStorage.getItem('deliveryAddress') || '{}');
const contactInfo = JSON.parse(sessionStorage.getItem('contactInfo') || '{}');

// Debug logging
console.log('Step 5 - Loaded data:', {
    selectedEquipment,
    selectedAddons,
    rentalDays,
    equipmentCost,
    addonsCost,
    subtotal,
    deliveryFee,
    needsDelivery
});

// If subtotal is 0, we have a problem - recalculate
if (subtotal === 0 && selectedEquipment && rentalDays > 0) {
    console.error('PRICING ERROR: Subtotal is 0, recalculating...');
    // Recalculate based on equipment and days
    const equipment = EQUIPMENT[selectedEquipment];
    let recalcEquipmentCost = 0;
    
    if (rentalDays >= 4 && rentalDays <= 7) {
        recalcEquipmentCost = equipment.weekly;
    } else if (rentalDays >= 8) {
        const weeks = Math.floor(rentalDays / 7);
        const remainingDays = rentalDays % 7;
        recalcEquipmentCost = (weeks * equipment.weekly) + (remainingDays * equipment.daily);
    } else {
        recalcEquipmentCost = rentalDays * equipment.daily;
    }
    
    let recalcAddonsCost = 0;
    selectedAddons.forEach(id => {
        const addon = ADDONS[id];
        if (addon) {
            if (rentalDays >= 4 && rentalDays <= 7) {
                recalcAddonsCost += addon.weekly;
            } else if (rentalDays >= 8) {
                const weeks = Math.floor(rentalDays / 7);
                const remainingDays = rentalDays % 7;
                recalcAddonsCost += (weeks * addon.weekly) + (remainingDays * addon.daily);
            } else {
                recalcAddonsCost += rentalDays * addon.daily;
            }
        }
    });
    
    // Override the zero values
    equipmentCost = recalcEquipmentCost;
    addonsCost = recalcAddonsCost;
    subtotal = equipmentCost + addonsCost;
    
    console.log('Recalculated pricing:', {equipmentCost, addonsCost, subtotal});
}

// Calculate security deposit
let securityDeposit = EQUIPMENT[selectedEquipment]?.deposit || 0;

// If rental is 7+ days, deposit = full rental amount
if (rentalDays >= 7) {
    securityDeposit = subtotal;
}

let damageWaiverCost = 0;
let hasCOI = false;

// Display order summary
function displaySummary() {
    // Equipment summary
    const equipmentHTML = `
        <div class="flex justify-between items-center">
            <span class="font-bold">${EQUIPMENT[selectedEquipment]?.name || 'Unknown'}</span>
            <span class="font-bold text-brandOrange">$${equipmentCost.toLocaleString()}</span>
        </div>
        ${selectedAddons.map(id => {
            const addon = ADDONS[id];
            if (!addon) return '';
            const cost = rentalDays >= 4 && rentalDays <= 7 ? addon.weekly : rentalDays * addon.daily;
            return `
                <div class="flex justify-between items-center text-sm">
                    <span class="text-zinc-400">+ ${addon.name}</span>
                    <span>$${cost.toLocaleString()}</span>
                </div>
            `;
        }).join('')}
    `;
    document.getElementById('equipment-summary').innerHTML = equipmentHTML;

    // Dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    document.getElementById('dates-summary').textContent = 
        `${start.toLocaleDateString()} - ${end.toLocaleDateString()} (${rentalDays} days)`;
    document.getElementById('pickup-time-summary').textContent = `Preferred pickup: ${pickupTime}`;

    // Delivery
    if (needsDelivery) {
        const deliveryHTML = `
            <p class="font-bold mb-1">Delivery to Jobsite</p>
            <p class="text-sm text-zinc-400">${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zip}</p>
            <p class="text-sm mt-2">Distance: ${deliveryAddress.distance || 'N/A'} miles</p>
            <p class="text-lg font-bold text-brandOrange mt-2">$${deliveryFee.toFixed(2)}</p>
        `;
        document.getElementById('delivery-summary').innerHTML = deliveryHTML;
    } else {
        document.getElementById('delivery-summary').innerHTML = '<p class="font-bold text-brandGreen">Pickup at Yard (No delivery fee)</p>';
    }

    // Contact
    document.getElementById('contact-summary').innerHTML = `
        <p class="font-bold">${contactInfo.firstName} ${contactInfo.lastName}</p>
        <p class="text-zinc-400">${contactInfo.email}</p>
        <p class="text-zinc-400">${contactInfo.phone}</p>
        ${contactInfo.company ? `<p class="text-zinc-400">${contactInfo.company}</p>` : ''}
    `;

    // Calculate damage waiver cost
    damageWaiverCost = Math.round(subtotal * 0.12); // 12%
    document.getElementById('damage-waiver-cost').textContent = `$${damageWaiverCost.toLocaleString()}`;

    // Security deposit
    document.getElementById('deposit-amount').textContent = `$${securityDeposit.toLocaleString()}`;

    // Initial totals
    calculateTotals();
}

function calculateTotals() {
    const waiverSelected = document.getElementById('damage-waiver')?.checked || false;
    
    let total = subtotal + deliveryFee;
    if (waiverSelected) {
        total += damageWaiverCost;
    }

    // Update final pricing display
    document.getElementById('final-equipment').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('final-delivery').textContent = needsDelivery ? `$${deliveryFee.toFixed(2)}` : 'FREE (Pickup)';
    
    if (waiverSelected) {
        document.getElementById('final-waiver-line').classList.remove('hidden');
        document.getElementById('final-waiver').textContent = `$${damageWaiverCost.toLocaleString()}`;
        document.getElementById('waiver-terms-link')?.classList.remove('hidden');
    } else {
        document.getElementById('final-waiver-line').classList.add('hidden');
        document.getElementById('waiver-terms-link')?.classList.add('hidden');
    }

    document.getElementById('grand-total').textContent = `$${total.toLocaleString()}`;
    
    // Update deposit display
    if (hasCOI) {
        document.getElementById('final-deposit').textContent = '$0';
        document.getElementById('deposit-waived-final').classList.remove('hidden');
    } else {
        document.getElementById('final-deposit').textContent = `$${securityDeposit.toLocaleString()}`;
        document.getElementById('deposit-waived-final').classList.add('hidden');
    }
}

function toggleCOI() {
    hasCOI = document.getElementById('has-coi')?.checked || false;
    document.getElementById('coi-requirements').classList.toggle('hidden', !hasCOI);
    document.getElementById('coi-waived-notice').classList.toggle('hidden', !hasCOI);
    document.getElementById('deposit-amount-display').classList.toggle('opacity-50', hasCOI);
    calculateTotals();
}

function goBack() {
    window.location.href = 'step-4-contact.html';
}

// Populate hidden form fields before submission
document.getElementById('booking-form').addEventListener('submit', function(e) {
    const waiverSelected = document.getElementById('damage-waiver')?.checked || false;
    const total = subtotal + deliveryFee + (waiverSelected ? damageWaiverCost : 0);

    // Populate hidden fields
    document.getElementById('form-equipment').value = EQUIPMENT[selectedEquipment]?.name || '';
    document.getElementById('form-addons').value = selectedAddons.map(id => ADDONS[id]?.name).join(', ');
    document.getElementById('form-start-date').value = startDate;
    document.getElementById('form-end-date').value = endDate;
    document.getElementById('form-rental-days').value = rentalDays;
    document.getElementById('form-pickup-time').value = pickupTime;
    document.getElementById('form-delivery-needed').value = needsDelivery ? 'Yes' : 'No';
    document.getElementById('form-delivery-address').value = needsDelivery ? 
        `${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zip}` : 'Pickup at yard';
    document.getElementById('form-customer-name').value = `${contactInfo.firstName} ${contactInfo.lastName}`;
    document.getElementById('form-customer-email').value = contactInfo.email;
    document.getElementById('form-customer-phone').value = contactInfo.phone;
    document.getElementById('form-company').value = contactInfo.company || 'N/A';
    document.getElementById('form-project-type').value = contactInfo.projectType || 'N/A';
    document.getElementById('form-notes').value = contactInfo.notes || 'None';
    document.getElementById('form-equipment-cost').value = `$${subtotal}`;
    document.getElementById('form-delivery-fee').value = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('form-damage-waiver').value = waiverSelected ? `Yes - $${damageWaiverCost}` : 'No';
    document.getElementById('form-total-cost').value = `$${total}`;
    document.getElementById('form-security-deposit').value = hasCOI ? '$0 (COI provided)' : `$${securityDeposit}`;
    document.getElementById('form-has-coi').value = hasCOI ? 'Yes' : 'No';
});

// Initialize on page load
displaySummary();
