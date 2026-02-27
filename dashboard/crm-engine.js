// ============================================
// TVDIRTCO FULL CRM ENGINE
// Customers, Leads, Quotes, Jobs, Pipeline, Scheduling, Profitability
// ============================================

class TVDirtCoCRM {
    constructor() {
        // Core Engines
        this.pricingEngine = window.ProductionPricingEngine ? new ProductionPricingEngine() : null;

        // Customer & Lead Database
        this.customers = this.loadFromStorage('customers') || [];
        this.leads = this.loadFromStorage('leads') || [];
        this.jobs = this.loadFromStorage('jobs') || [];
        this.quotes = this.loadFromStorage('quotes') || [];

        // Pipeline Stages
        this.pipelineStages = [
            'Lead',             // New inquiry
            'Contacted',        // Initial contact made
            'Quote Sent',       // Quote sent to client
            'Negotiation',      // Discussion on price/add-ons
            'Accepted',         // Client agreed
            'In Progress',      // Work underway
            'Completed',        // Job finished
            'Follow-Up'         // Post-job follow-up
        ];
    }

    // ============================================
    // STORAGE MANAGEMENT
    // ============================================
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(`tvdirtco_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Error loading ${key}:`, e);
            return null;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(`tvdirtco_${key}`, JSON.stringify(data));
        } catch (e) {
            console.error(`Error saving ${key}:`, e);
        }
    }

    // ============================================
    // CUSTOMER MANAGEMENT
    // ============================================
    addCustomer(customerData) {
        const id = 'C' + Date.now();
        const customer = {
            id,
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            address: customerData.address || '',
            company: customerData.company || '',
            notes: [],
            tags: customerData.tags || [],
            createdAt: new Date().toISOString(),
            lastContacted: null,
            totalRevenue: 0,
            totalJobs: 0,
            followUps: []
        };
        this.customers.push(customer);
        this.saveToStorage('customers', this.customers);
        return customer;
    }

    updateCustomer(customerId, updates) {
        const customer = this.customers.find(c => c.id === customerId);
        if (!customer) return null;
        Object.assign(customer, updates);
        customer.lastUpdated = new Date().toISOString();
        this.saveToStorage('customers', this.customers);
        return customer;
    }

    deleteCustomer(customerId) {
        const index = this.customers.findIndex(c => c.id === customerId);
        if (index === -1) return false;
        this.customers.splice(index, 1);
        this.saveToStorage('customers', this.customers);
        return true;
    }

    addCustomerNote(customerId, note) {
        const customer = this.customers.find(c => c.id === customerId);
        if (!customer) return null;
        customer.notes.push({ 
            note, 
            date: new Date().toISOString(),
            author: 'Evan Tremper'
        });
        this.saveToStorage('customers', this.customers);
        return customer;
    }

    getCustomer(customerId) {
        return this.customers.find(c => c.id === customerId);
    }

    getAllCustomers() {
        return this.customers;
    }

    searchCustomers(query) {
        const q = query.toLowerCase();
        return this.customers.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            (c.company && c.company.toLowerCase().includes(q))
        );
    }

    // ============================================
    // LEAD MANAGEMENT
    // ============================================
    addLead(leadData) {
        const id = 'L' + Date.now();
        const lead = {
            id,
            customerName: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            source: leadData.source || 'Website',
            stage: 'Lead',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            potentialJobs: [],
            notes: []
        };
        this.leads.push(lead);
        this.saveToStorage('leads', this.leads);
        return lead;
    }

    updateLeadStage(leadId, stage) {
        const lead = this.leads.find(l => l.id === leadId);
        if (!lead) return null;
        if (!this.pipelineStages.includes(stage)) return null;
        lead.stage = stage;
        lead.lastUpdated = new Date().toISOString();
        this.saveToStorage('leads', this.leads);
        return lead;
    }

    convertLeadToCustomer(leadId) {
        const lead = this.leads.find(l => l.id === leadId);
        if (!lead) return null;
        
        const customer = this.addCustomer({
            name: lead.customerName,
            email: lead.email,
            phone: lead.phone,
            tags: ['Converted Lead']
        });
        
        // Remove from leads
        this.leads = this.leads.filter(l => l.id !== leadId);
        this.saveToStorage('leads', this.leads);
        
        return customer;
    }

    // ============================================
    // QUOTE MANAGEMENT
    // ============================================
    generateQuote(customerId, jobData) {
        const id = 'Q' + Date.now();
        const customer = this.getCustomer(customerId);
        if (!customer) return null;

        let result;
        if (!this.pricingEngine) {
            console.error('Pricing engine not loaded');
            return null;
        }

        switch(jobData.type) {
            case 'brush-clearing':
                result = this.pricingEngine.calculateBrushClearing(
                    jobData.acreage,
                    jobData.density,
                    jobData.access,
                    jobData.distanceMiles || 0,
                    jobData.addOns || []
                );
                break;
            case 'trenching':
                result = this.pricingEngine.calculateTrenching(
                    jobData.linearFeet,
                    jobData.depth,
                    jobData.soilType,
                    jobData.distanceMiles || 0,
                    jobData.addOns || []
                );
                break;
            case 'site-prep':
                result = this.pricingEngine.calculateSitePrep(
                    jobData.isFullDay,
                    jobData.distanceMiles || 0,
                    jobData.addOns || []
                );
                break;
            default:
                throw new Error('Invalid job type');
        }

        const quote = {
            id,
            customerId,
            customerName: customer.name,
            jobType: jobData.type,
            jobDetails: jobData,
            pricing: result,
            status: 'Quote Sent',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        };

        this.quotes.push(quote);
        this.saveToStorage('quotes', this.quotes);
        return quote;
    }

    acceptQuote(quoteId) {
        const quote = this.quotes.find(q => q.id === quoteId);
        if (!quote) return null;

        quote.status = 'Accepted';
        this.saveToStorage('quotes', this.quotes);

        // Create job from quote
        const jobId = 'J' + Date.now();
        const job = {
            id: jobId,
            customerId: quote.customerId,
            customerName: quote.customerName,
            jobType: quote.jobType,
            jobDetails: quote.jobDetails,
            pricing: quote.pricing,
            stage: 'Accepted',
            createdAt: new Date().toISOString(),
            scheduledDate: null,
            completedDate: null,
            estimatedStartDates: this.pricingEngine ? 
                this.pricingEngine.getTop3AvailableDates([], quote.pricing.production.daysRequired) : []
        };
        this.jobs.push(job);
        this.saveToStorage('jobs', this.jobs);

        // Update customer stats
        const customer = this.getCustomer(quote.customerId);
        if (customer) {
            customer.totalJobs = (customer.totalJobs || 0) + 1;
            customer.totalRevenue = (customer.totalRevenue || 0) + quote.pricing.finalPrice;
            this.saveToStorage('customers', this.customers);
        }

        return job;
    }

    // ============================================
    // JOB MANAGEMENT
    // ============================================
    updateJobStage(jobId, stage) {
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) return null;
        if (!this.pipelineStages.includes(stage)) return null;
        
        job.stage = stage;
        job.lastUpdated = new Date().toISOString();
        
        if (stage === 'Completed') {
            job.completedDate = new Date().toISOString();
        }
        
        this.saveToStorage('jobs', this.jobs);
        return job;
    }

    getJobsByCustomer(customerId) {
        return this.jobs.filter(j => j.customerId === customerId);
    }

    getAllJobs() {
        return this.jobs;
    }

    getPipelineOverview() {
        const overview = {};
        this.pipelineStages.forEach(stage => { overview[stage] = [] });
        
        this.jobs.forEach(job => {
            if (overview[job.stage]) {
                overview[job.stage].push({
                    id: job.id,
                    customer: job.customerName,
                    jobType: job.jobType,
                    finalPrice: job.pricing.finalPrice
                });
            }
        });
        
        return overview;
    }

    // ============================================
    // FOLLOW-UP MANAGEMENT
    // ============================================
    scheduleFollowUp(customerId, message, date) {
        const customer = this.getCustomer(customerId);
        if (!customer) return null;
        
        customer.followUps.push({ 
            message, 
            date, 
            completed: false,
            createdAt: new Date().toISOString()
        });
        
        this.saveToStorage('customers', this.customers);
        return customer;
    }

    markFollowUpComplete(customerId, index) {
        const customer = this.getCustomer(customerId);
        if (!customer || !customer.followUps || !customer.followUps[index]) return null;
        
        customer.followUps[index].completed = true;
        customer.followUps[index].completedAt = new Date().toISOString();
        
        this.saveToStorage('customers', this.customers);
        return customer;
    }

    // ============================================
    // ANALYTICS
    // ============================================
    calculateRevenueByStage() {
        const revenue = {};
        this.pipelineStages.forEach(stage => revenue[stage] = 0);
        
        this.jobs.forEach(job => {
            if (['Accepted', 'In Progress', 'Completed'].includes(job.stage)) {
                revenue[job.stage] += job.pricing.finalPrice;
            }
        });
        
        return revenue;
    }

    calculateGrossProfit() {
        let totalProfit = 0;
        this.jobs.forEach(job => {
            if (['Accepted', 'In Progress', 'Completed'].includes(job.stage)) {
                totalProfit += job.pricing.profit.grossProfit;
            }
        });
        return totalProfit;
    }

    getCustomerLifetimeValue(customerId) {
        const jobs = this.getJobsByCustomer(customerId);
        return jobs.reduce((sum, job) => {
            if (['Completed', 'In Progress'].includes(job.stage)) {
                return sum + job.pricing.finalPrice;
            }
            return sum;
        }, 0);
    }

    // ============================================
    // SEARCH
    // ============================================
    searchJobs(query) {
        const q = query.toLowerCase();
        return this.jobs.filter(j =>
            j.customerName.toLowerCase().includes(q) ||
            j.jobType.toLowerCase().includes(q) ||
            j.id.toLowerCase().includes(q)
        );
    }

    // ============================================
    // EXPORT DATA
    // ============================================
    exportCustomersToCSV() {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Total Jobs', 'Total Revenue', 'Created'];
        const rows = this.customers.map(c => [
            c.id,
            c.name,
            c.email,
            c.phone,
            c.company || '',
            c.totalJobs || 0,
            c.totalRevenue || 0,
            new Date(c.createdAt).toLocaleDateString()
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
}

// EXPORT
window.TVDirtCoCRM = TVDirtCoCRM;
