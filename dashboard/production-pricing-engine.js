// TVDirtCo Production-Based Smart Pricing Engine
// Complete pricing, profit tracking, scheduling, and close probability system

class ProductionPricingEngine {
    constructor() {
        // Global Settings
        this.marketAdjustmentMultiplier = 0.8;
        this.dailyRateBrush = 2000;
        this.dailyRateTrenching = 1800;
        this.productionRateTrenching = 200; // feet per day
        this.machineWearPerHour = 35;
        this.fuelCostPerDay = 150;
        this.laborCostPerDay = 400;
        this.baseMobilization = 250;
        this.includedMiles = 20;
        this.mileageRate = 3;
        
        // Production Rates
        this.brushProductionRates = {
            light: 0.75,    // acres per day
            medium: 0.5,
            heavy: 0.25
        };
        
        // Multipliers
        this.accessMultipliers = {
            easy: 1.0,
            moderate: 1.25,
            difficult: 1.5
        };
        
        this.depthMultipliers = {
            12: 1.0,
            18: 1.2,
            24: 1.4,
            36: 1.8
        };
        
        this.soilMultipliers = {
            soft: 0.9,
            normal: 1.0,
            hard: 1.3
        };
        
        // Site Prep Rates
        this.halfDayRate = 950;
        this.fullDayRate = 1800;
        
        // Add-ons
        this.addOns = {
            compactionPass: 250,
            fineGradingFinish: 300,
            haulAwayPerLoad: 450,
            backfillCompaction: 350,
            spoilRemoval: 400
        };
    }
    
    // BRUSH CLEARING CALCULATION
    calculateBrushClearing(acreage, density, access, distanceMiles = 0, addOns = []) {
        const productionRate = this.brushProductionRates[density];
        const daysRequired = acreage / productionRate;
        const baseProductionPrice = daysRequired * this.dailyRateBrush;
        const adjustedPrice = baseProductionPrice * this.accessMultipliers[access];
        
        const mobilizationFee = this.calculateMobilization(distanceMiles);
        const addOnsTotal = this.calculateAddOns(addOns);
        
        const finalPrice = Math.round(
            (adjustedPrice + mobilizationFee + addOnsTotal) * this.marketAdjustmentMultiplier
        );
        
        const costs = this.calculateInternalCosts(daysRequired, mobilizationFee);
        const profit = this.calculateProfit(finalPrice, costs.totalInternalCost);
        
        return {
            finalPrice,
            breakdown: {
                baseProductionPrice: Math.round(baseProductionPrice),
                adjustedPrice: Math.round(adjustedPrice),
                mobilizationFee,
                addOnsTotal,
                marketAdjustment: this.marketAdjustmentMultiplier
            },
            production: {
                daysRequired: Math.round(daysRequired * 10) / 10,
                estimatedHours: Math.round(daysRequired * 8)
            },
            costs,
            profit,
            upsells: this.getUpsellSuggestions('brush-clearing', addOns)
        };
    }
    
    // TRENCHING CALCULATION
    calculateTrenching(linearFeet, depth, soilType, distanceMiles = 0, addOns = []) {
        const daysRequired = linearFeet / this.productionRateTrenching;
        const baseProductionPrice = daysRequired * this.dailyRateTrenching;
        const adjustedPrice = baseProductionPrice * 
                             this.depthMultipliers[depth] * 
                             this.soilMultipliers[soilType];
        
        const mobilizationFee = this.calculateMobilization(distanceMiles);
        const addOnsTotal = this.calculateAddOns(addOns);
        
        const finalPrice = Math.round(
            (adjustedPrice + mobilizationFee + addOnsTotal) * this.marketAdjustmentMultiplier
        );
        
        const costs = this.calculateInternalCosts(daysRequired, mobilizationFee);
        const profit = this.calculateProfit(finalPrice, costs.totalInternalCost);
        
        return {
            finalPrice,
            breakdown: {
                baseProductionPrice: Math.round(baseProductionPrice),
                adjustedPrice: Math.round(adjustedPrice),
                mobilizationFee,
                addOnsTotal,
                marketAdjustment: this.marketAdjustmentMultiplier
            },
            production: {
                daysRequired: Math.round(daysRequired * 10) / 10,
                estimatedHours: Math.round(daysRequired * 8),
                productionRate: this.productionRateTrenching
            },
            costs,
            profit,
            upsells: this.getUpsellSuggestions('trenching', addOns)
        };
    }
    
    // SITE PREP CALCULATION
    calculateSitePrep(isFullDay, distanceMiles = 0, addOns = []) {
        const selectedRate = isFullDay ? this.fullDayRate : this.halfDayRate;
        const baseProductionPrice = selectedRate;
        const daysRequired = isFullDay ? 1.0 : 0.5;
        
        const mobilizationFee = this.calculateMobilization(distanceMiles);
        const addOnsTotal = this.calculateAddOns(addOns);
        
        const finalPrice = Math.round(
            (baseProductionPrice + mobilizationFee + addOnsTotal) * this.marketAdjustmentMultiplier
        );
        
        const costs = this.calculateInternalCosts(daysRequired, mobilizationFee);
        const profit = this.calculateProfit(finalPrice, costs.totalInternalCost);
        
        return {
            finalPrice,
            breakdown: {
                baseProductionPrice,
                mobilizationFee,
                addOnsTotal,
                marketAdjustment: this.marketAdjustmentMultiplier
            },
            production: {
                daysRequired,
                estimatedHours: isFullDay ? 8 : 4
            },
            costs,
            profit,
            upsells: this.getUpsellSuggestions('site-prep', addOns)
        };
    }
    
    // MOBILIZATION CALCULATION
    calculateMobilization(distanceMiles) {
        if (distanceMiles <= this.includedMiles) {
            return this.baseMobilization;
        }
        const distanceCharge = (distanceMiles - this.includedMiles) * this.mileageRate;
        return this.baseMobilization + distanceCharge;
    }
    
    // ADD-ONS CALCULATION
    calculateAddOns(selectedAddOns) {
        return selectedAddOns.reduce((total, addon) => {
            return total + (this.addOns[addon] || 0);
        }, 0);
    }
    
    // INTERNAL COST TRACKING
    calculateInternalCosts(daysRequired, mobilizationFee) {
        const estimatedHours = daysRequired * 8;
        const machineWearCost = estimatedHours * this.machineWearPerHour;
        const fuelCost = daysRequired * this.fuelCostPerDay;
        const laborCost = daysRequired * this.laborCostPerDay;
        const totalInternalCost = machineWearCost + fuelCost + laborCost + mobilizationFee;
        
        return {
            estimatedHours: Math.round(estimatedHours),
            machineWearCost: Math.round(machineWearCost),
            fuelCost: Math.round(fuelCost),
            laborCost: Math.round(laborCost),
            mobilizationFee,
            totalInternalCost: Math.round(totalInternalCost)
        };
    }
    
    // PROFIT CALCULATION
    calculateProfit(finalPrice, totalInternalCost) {
        const grossProfit = finalPrice - totalInternalCost;
        const marginPercent = (grossProfit / finalPrice) * 100;
        const lowMarginFlag = marginPercent < 30;
        
        return {
            grossProfit: Math.round(grossProfit),
            marginPercent: Math.round(marginPercent * 10) / 10,
            lowMarginFlag,
            status: lowMarginFlag ? 'WARNING: Low Margin' : 
                   marginPercent < 35 ? 'Acceptable' : 'Excellent'
        };
    }
    
    // TOP 3 AVAILABLE START DATES
    getTop3AvailableDates(existingBookings, estimatedDaysRequired) {
        const availableDates = [];
        let currentDate = new Date();
        let daysChecked = 0;
        const maxDaysToCheck = 90; // Look ahead 3 months max
        
        while (availableDates.length < 3 && daysChecked < maxDaysToCheck) {
            // Skip weekends
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                // Check if consecutive days are available
                if (this.isDateRangeAvailable(currentDate, estimatedDaysRequired, existingBookings)) {
                    availableDates.push({
                        date: new Date(currentDate),
                        formatted: currentDate.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                        }),
                        daysOut: Math.floor((currentDate - new Date()) / (1000 * 60 * 60 * 24))
                    });
                }
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
            daysChecked++;
        }
        
        return availableDates;
    }
    
    isDateRangeAvailable(startDate, daysRequired, existingBookings) {
        const daysToCheck = Math.ceil(daysRequired);
        
        for (let i = 0; i < daysToCheck; i++) {
            const checkDate = new Date(startDate);
            checkDate.setDate(checkDate.getDate() + i);
            
            // Skip if weekend
            const dayOfWeek = checkDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                return false;
            }
            
            // Check against existing bookings
            const dateStr = checkDate.toISOString().split('T')[0];
            if (existingBookings && existingBookings.includes(dateStr)) {
                return false;
            }
        }
        
        return true;
    }
    
    // CLOSE PROBABILITY SCORE
    calculateCloseProbability(params) {
        let score = 0;
        
        if (params.returningCustomer) score += 20;
        if (params.jobValue > 3000) score += 10;
        if (params.distanceMiles < 15) score += 10;
        if (params.marginPercent > 35) score += 20;
        if (params.earliestStartWithin7Days) score += 15;
        
        let probability = 'Low';
        if (score >= 71) probability = 'High';
        else if (score >= 41) probability = 'Medium';
        
        return {
            score,
            probability,
            factors: {
                returningCustomer: params.returningCustomer ? '✓ +20' : '✗',
                highValue: params.jobValue > 3000 ? '✓ +10' : '✗',
                closeDistance: params.distanceMiles < 15 ? '✓ +10' : '✗',
                goodMargin: params.marginPercent > 35 ? '✓ +20' : '✗',
                quickStart: params.earliestStartWithin7Days ? '✓ +15' : '✗'
            }
        };
    }
    
    // UPSELL SUGGESTIONS
    getUpsellSuggestions(jobType, currentAddOns) {
        const suggestions = [];
        
        if (jobType === 'brush-clearing') {
            if (!currentAddOns.includes('haulAwayPerLoad')) {
                suggestions.push({
                    name: 'Haul Away Service',
                    cost: this.addOns.haulAwayPerLoad,
                    key: 'haulAwayPerLoad',
                    benefit: 'We remove all debris - site left clean'
                });
            }
            if (!currentAddOns.includes('fineGradingFinish')) {
                suggestions.push({
                    name: 'Fine Grading Finish',
                    cost: this.addOns.fineGradingFinish,
                    key: 'fineGradingFinish',
                    benefit: 'Smooth, level finish ready for landscaping'
                });
            }
        } else if (jobType === 'trenching') {
            if (!currentAddOns.includes('backfillCompaction')) {
                suggestions.push({
                    name: 'Backfill & Compaction',
                    cost: this.addOns.backfillCompaction,
                    key: 'backfillCompaction',
                    benefit: 'Proper compaction prevents settling'
                });
            }
            if (!currentAddOns.includes('spoilRemoval')) {
                suggestions.push({
                    name: 'Spoil Removal',
                    cost: this.addOns.spoilRemoval,
                    key: 'spoilRemoval',
                    benefit: 'We haul away all excavated material'
                });
            }
        } else if (jobType === 'site-prep') {
            if (!currentAddOns.includes('compactionPass')) {
                suggestions.push({
                    name: 'Compaction Pass',
                    cost: this.addOns.compactionPass,
                    key: 'compactionPass',
                    benefit: 'Ensures stable, solid base'
                });
            }
            if (!currentAddOns.includes('fineGradingFinish')) {
                suggestions.push({
                    name: 'Fine Grading Finish',
                    cost: this.addOns.fineGradingFinish,
                    key: 'fineGradingFinish',
                    benefit: 'Professional smooth finish'
                });
            }
        }
        
        return suggestions;
    }
    
    // MARKET ADJUSTMENT CONTROL
    updateMarketMultiplier(newMultiplier) {
        this.marketAdjustmentMultiplier = newMultiplier;
    }
    
    getCurrentMarketMultiplier() {
        return this.marketAdjustmentMultiplier;
    }
}

// Export for use
window.ProductionPricingEngine = ProductionPricingEngine;
