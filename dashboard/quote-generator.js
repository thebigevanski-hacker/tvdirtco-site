// TVDirtCo Quote PDF Generator
// Uses jsPDF library to create professional branded quote PDFs

class QuotePDFGenerator {
    constructor() {
        this.brandColors = {
            orange: [255, 127, 39],
            tan: [170, 137, 100],
            green: [62, 85, 40],
            black: [13, 13, 13]
        };
    }

    async generateRentalQuote(quoteData) {
        // Load jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        
        // Header with branding
        this.addHeader(doc, pageWidth);
        
        // Quote info section
        let yPos = 60;
        yPos = this.addQuoteInfo(doc, quoteData, yPos);
        
        // Customer info
        yPos = this.addCustomerInfo(doc, quoteData, yPos);
        
        // Line items
        yPos = this.addLineItems(doc, quoteData, yPos);
        
        // Total
        yPos = this.addTotal(doc, quoteData, yPos);
        
        // Terms & conditions
        yPos = this.addTerms(doc, yPos, pageHeight);
        
        // Footer
        this.addFooter(doc, pageHeight);
        
        return doc;
    }

    addHeader(doc, pageWidth) {
        // Background stripe
        doc.setFillColor(...this.brandColors.orange);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        // Company name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('TEMECULA VALLEY', 15, 20);
        doc.setFontSize(26);
        doc.text('DIRT CO.', 15, 32);
        
        // Tagline
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('BUILT DIFFERENT', pageWidth - 15, 25, { align: 'right' });
        
        // Quote label
        doc.setFillColor(...this.brandColors.black);
        doc.rect(pageWidth - 60, 28, 45, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text('QUOTE', pageWidth - 15, 35, { align: 'right' });
    }

    addQuoteInfo(doc, quoteData, yPos) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        // Quote details in right column
        const rightCol = doc.internal.pageSize.width - 15;
        doc.text(`Quote #: ${quoteData.quoteNumber}`, rightCol, yPos, { align: 'right' });
        doc.text(`Date: ${quoteData.quoteDate}`, rightCol, yPos + 5, { align: 'right' });
        doc.text(`Valid Until: ${quoteData.expirationDate}`, rightCol, yPos + 10, { align: 'right' });
        
        return yPos + 20;
    }

    addCustomerInfo(doc, quoteData, yPos) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...this.brandColors.orange);
        doc.text('CUSTOMER INFORMATION', 15, yPos);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        
        yPos += 8;
        doc.text(quoteData.customerName, 15, yPos);
        if (quoteData.customerCompany) {
            yPos += 5;
            doc.text(quoteData.customerCompany, 15, yPos);
        }
        yPos += 5;
        doc.text(quoteData.customerEmail, 15, yPos);
        yPos += 5;
        doc.text(quoteData.customerPhone, 15, yPos);
        
        return yPos + 15;
    }

    addLineItems(doc, quoteData, yPos) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...this.brandColors.orange);
        doc.text('RENTAL DETAILS', 15, yPos);
        
        yPos += 8;
        
        // Table header
        doc.setFillColor(240, 240, 240);
        doc.rect(15, yPos, doc.internal.pageSize.width - 30, 8, 'F');
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('DESCRIPTION', 20, yPos + 5);
        doc.text('AMOUNT', doc.internal.pageSize.width - 20, yPos + 5, { align: 'right' });
        
        yPos += 10;
        
        // Line items
        doc.setFont('helvetica', 'normal');
        
        // Equipment rental
        doc.text(quoteData.equipment, 20, yPos);
        doc.text(`${quoteData.rentalDays} days (${quoteData.startDate} - ${quoteData.endDate})`, 20, yPos + 4);
        doc.text(`$${quoteData.equipmentCost.toFixed(2)}`, doc.internal.pageSize.width - 20, yPos, { align: 'right' });
        yPos += 12;
        
        // Damage waiver
        if (quoteData.damageWaiver) {
            doc.text('Damage Waiver (12% - Recommended)', 20, yPos);
            doc.text('Covers accidental damage up to equipment value', 20, yPos + 4);
            doc.text(`$${quoteData.damageWaiverCost.toFixed(2)}`, doc.internal.pageSize.width - 20, yPos, { align: 'right' });
            yPos += 12;
        }
        
        // Delivery
        if (quoteData.deliveryFee > 0) {
            doc.text('Delivery & Pickup Service', 20, yPos);
            doc.text(quoteData.deliveryAddress, 20, yPos + 4);
            doc.text(`$${quoteData.deliveryFee.toFixed(2)}`, doc.internal.pageSize.width - 20, yPos, { align: 'right' });
            yPos += 12;
        }
        
        return yPos + 5;
    }

    addTotal(doc, quoteData, yPos) {
        const pageWidth = doc.internal.pageSize.width;
        
        // Divider line
        doc.setDrawColor(...this.brandColors.orange);
        doc.setLineWidth(1);
        doc.line(15, yPos, pageWidth - 15, yPos);
        
        yPos += 8;
        
        // Total
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...this.brandColors.orange);
        doc.text('TOTAL QUOTE:', 20, yPos);
        doc.setFontSize(18);
        doc.text(`$${quoteData.totalCost.toFixed(2)}`, pageWidth - 20, yPos, { align: 'right' });
        
        yPos += 10;
        
        // Security deposit
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Security Deposit Required:', 20, yPos);
        doc.text(`$${quoteData.securityDeposit}`, pageWidth - 20, yPos, { align: 'right' });
        
        if (quoteData.hasCOI) {
            yPos += 5;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(0, 150, 0);
            doc.text('✓ Reduced deposit - Certificate of Insurance on file', 20, yPos);
        }
        
        return yPos + 15;
    }

    addTerms(doc, yPos, pageHeight) {
        // Only add if enough space
        if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...this.brandColors.orange);
        doc.text('TERMS & CONDITIONS', 15, yPos);
        
        yPos += 6;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        
        const terms = [
            '• This quote is valid for 7 days from the date issued.',
            '• Security deposit required at time of rental. Refunded upon return with no damage.',
            '• Equipment must be returned in clean, working condition.',
            '• Customer responsible for fuel costs during rental period.',
            '• Late returns subject to additional daily charges.',
            '• Damage waiver recommended - covers accidental damage (normal wear excluded).',
            '• Certificate of Insurance reduces security deposit requirements.',
            '• Delivery fees based on distance. Pickup at yard also available.',
            '• Payment due at time of pickup or delivery.',
            '• Accepted payment methods: Cash, Check, Credit Card, Venmo, Zelle.'
        ];
        
        terms.forEach(term => {
            doc.text(term, 20, yPos);
            yPos += 4;
        });
        
        return yPos;
    }

    addFooter(doc, pageHeight) {
        const yPos = pageHeight - 20;
        
        doc.setFillColor(...this.brandColors.black);
        doc.rect(0, yPos - 5, doc.internal.pageSize.width, 25, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        doc.text('Temecula Valley Dirt Co.', doc.internal.pageSize.width / 2, yPos + 3, { align: 'center' });
        doc.text('Temecula, CA 92590 • (951) 555-3478', doc.internal.pageSize.width / 2, yPos + 8, { align: 'center' });
        doc.text('evan@tvdirtco.com • www.tvdirtco.com', doc.internal.pageSize.width / 2, yPos + 13, { align: 'center' });
    }

    generateQuoteNumber() {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `Q${year}${month}${day}-${random}`;
    }

    getExpirationDate(daysValid = 7) {
        const date = new Date();
        date.setDate(date.getDate() + daysValid);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    getCurrentDate() {
        return new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

// Email quote sender (uses EmailJS or similar)
class QuoteEmailer {
    constructor() {
        // Initialize EmailJS or your email service
        this.serviceID = 'YOUR_SERVICE_ID';
        this.templateID = 'YOUR_TEMPLATE_ID';
        this.publicKey = 'YOUR_PUBLIC_KEY';
    }

    async sendQuote(quoteData, pdfBlob) {
        // Convert PDF to base64 for email attachment
        const base64PDF = await this.blobToBase64(pdfBlob);
        
        const emailParams = {
            to_email: quoteData.customerEmail,
            to_name: quoteData.customerName,
            quote_number: quoteData.quoteNumber,
            total_cost: quoteData.totalCost,
            equipment: quoteData.equipment,
            start_date: quoteData.startDate,
            pdf_attachment: base64PDF
        };
        
        // Send via EmailJS or your service
        // emailjs.send(this.serviceID, this.templateID, emailParams, this.publicKey)
        
        return {
            success: true,
            message: 'Quote sent successfully!'
        };
    }

    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async sendQuoteSMS(phoneNumber, quoteData) {
        // SMS implementation via Twilio or similar
        const message = `TVDirtCo Quote #${quoteData.quoteNumber}: ${quoteData.equipment} rental ${quoteData.startDate}-${quoteData.endDate}. Total: $${quoteData.totalCost}. Check your email for full quote PDF.`;
        
        // Send SMS here
        console.log('SMS sent:', message);
        
        return { success: true };
    }
}

// Export for use in quotes.html
window.QuotePDFGenerator = QuotePDFGenerator;
window.QuoteEmailer = QuoteEmailer;
