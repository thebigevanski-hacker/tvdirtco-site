# 🚀 TVDirtCo Booking System - COMPLETE!

## ✅ WHAT YOU HAVE

A **fully functional** 5-step booking wizard for equipment rentals with:
- Smart pricing calculator
- Delivery fee system
- Security deposit logic
- Damage waiver option
- COI upload
- Formspree integration

---

## 📁 FILES INCLUDED

```
booking-app/
├── step-1-equipment.html    ✅ Equipment selection
├── step-2-dates.html         ✅ Date picker & pricing
├── step-3-delivery.html      ✅ Delivery or pickup
├── step-4-contact.html       ✅ Contact information
├── step-5-confirm.html       ✅ Review & submit
├── step-5-logic.js           ✅ Step 5 JavaScript
└── success.html              ✅ Confirmation page
```

---

## 🎯 FEATURES IMPLEMENTED

### **Step 1: Equipment Selection**
✅ 3 primary equipment options with correct pricing  
✅ 3 bucket add-ons (12", 18", 24")  
✅ Weekly rates = 4× daily  
✅ Visual card selection  
✅ Selection summary  

### **Step 2: Date & Pricing Calculator**
✅ Date range picker  
✅ Duration calculator  
✅ Smart weekly rate logic:
   - 1-3 days = Daily rate × days
   - 4-7 days = Weekly rate (auto-applied)
   - 8+ days = Weeks + days calculation  
✅ Complete pricing breakdown  
✅ Live price updates  

### **Step 3: Delivery Options**
✅ Toggle: Delivery or Pickup  
✅ Temecula city limits check  
✅ Delivery pricing:
   - FREE within Temecula
   - $40 + ($2 × miles) outside Temecula  
✅ Address collection  
✅ Manual distance entry  

### **Step 4: Contact Information**
✅ Name, email, phone (required)  
✅ Company name (optional)  
✅ Project type dropdown  
✅ Special notes field  
✅ Form validation  

### **Step 5: Confirm & Submit**
✅ Complete order summary  
✅ Damage waiver option (12%)  
✅ Security deposit calculation:
   - Mini Excavator: $1,000
   - Skid Steer: $800
   - Dump Trailer: $500
   - 7+ days: Full rental amount  
✅ COI upload option (waives deposit)  
✅ Optional document uploads  
✅ Terms & conditions  
✅ Final pricing display  
✅ Formspree submission  

---

## 💰 PRICING STRUCTURE

### **Equipment:**
- Mini Excavator: $250/day, $1,000/week
- Skid Steer: $280/day, $1,120/week
- Dump Trailer: $100/day, $400/week

### **Add-Ons:**
- 12" Bucket: $30/day, $120/week
- 18" Bucket: $35/day, $140/week
- 24" Bucket: $45/day, $180/week

### **Delivery:**
- Within Temecula: FREE
- Outside Temecula: $40 + ($2 × distance)

### **Damage Waiver:**
- 12% of equipment + add-ons subtotal
- Optional (reduces liability)

### **Security Deposits:**
- Mini Excavator: $1,000
- Skid Steer: $800
- Dump Trailer: $500
- **7+ day rentals:** 100% of rental cost
- **Waived** with valid COI

---

## 🧪 TESTING INSTRUCTIONS

### **Test Scenario 1: Short Rental (Daily Rate)**
1. Open `step-1-equipment.html`
2. Select: Mini Excavator
3. Select: 2 days (e.g., Mar 10-11)
4. Choose: Pickup at yard
5. Enter contact info
6. Review: $500 total, $1,000 deposit

### **Test Scenario 2: Weekly Rental with Delivery**
1. Select: Skid Steer + 18" Bucket
2. Select: 5 days (triggers weekly rate)
3. Delivery: Outside Temecula, 20 miles
4. Enter contact info
5. Add: Damage waiver (12%)
6. Review pricing breakdown

### **Test Scenario 3: Extended Rental with COI**
1. Select: Mini Excavator
2. Select: 10 days (extended rental)
3. Delivery: Within Temecula (free)
4. Enter contact info
5. Check: "I have COI"
6. Review: Deposit waived

---

## 🔧 DEPLOYMENT

### **Quick Test (Local)**
1. Download all files
2. Keep folder structure intact
3. Open `step-1-equipment.html` in browser
4. Test complete flow

### **Deploy to Vercel (Production)**

```bash
# 1. Create GitHub repo
git init
git add .
git commit -m "TVDirtCo booking system"
git branch -M main
git remote add origin [your-repo-url]
git push -u origin main

# 2. Deploy on Vercel
# - Go to vercel.com
# - Import GitHub repo
# - Click Deploy
# - Done! Live at booking.tvdirt.com
```

---

## 📧 FORMSPREE CONFIGURATION

**Current endpoint:** `https://formspree.io/f/xkozdpke`

### **What Formspree Receives:**
- Equipment details
- Rental dates
- Delivery info
- Customer contact
- Pricing breakdown
- Damage waiver selection
- Security deposit amount
- COI status
- Uploaded documents

### **Email Notifications:**
You'll receive an email with all booking details when customer submits.

### **Upgrade Options:**
- Free tier: 50 submissions/month
- Gold ($10/mo): 1,000 submissions/month
- Platinum ($40/mo): Unlimited

---

## 🔐 SECURITY & PRIVACY

✅ HTTPS only (Vercel provides free SSL)  
✅ File upload validation (PDF, JPG, PNG only)  
✅ Form validation on all required fields  
✅ Honeypot spam protection (Formspree)  
✅ Session storage (data cleared after booking)  
✅ No payment processing (manual for V1)  

---

## 📊 WHAT HAPPENS AFTER SUBMISSION

1. **Customer submits booking** → Step 5
2. **Formspree receives** all data
3. **You get email** with complete booking details
4. **Customer sees** success page
5. **You call customer** to confirm (within 2 hours)
6. **You manually process:**
   - Payment collection
   - Security deposit hold
   - COI verification (if provided)
   - Equipment preparation
7. **Deliver or customer picks up**

---

## 🚀 V2 ENHANCEMENTS (FUTURE)

### **Backend & Database** (Week 2-3)
- Firebase setup
- Admin dashboard
- Booking management
- Equipment calendar
- Document storage

### **Payment Integration** (Week 3-4)
- Stripe integration
- Auto-charge deposits
- Online payment processing
- Refund automation

### **Advanced Features** (Week 4+)
- User accounts
- Booking history
- Email automation
- SMS notifications
- GPS tracking (optional)
- Analytics dashboard

---

## 💡 CUSTOMIZATION GUIDE

### **Update Contact Info:**
Search for `951-555-3478` and replace with your real phone number.

### **Update Formspree Endpoint:**
Replace `https://formspree.io/f/xkozdpke` with your Formspree endpoint.

### **Adjust Pricing:**
Edit the `EQUIPMENT` and `ADDONS` objects in:
- `step-1-equipment.html`
- `step-2-dates.html`
- `step-5-logic.js`

### **Change Deposit Amounts:**
Edit in `step-5-logic.js`:
```javascript
const EQUIPMENT = {
    'mini-excavator': { ..., deposit: 1000 },
    'skid-steer': { ..., deposit: 800 },
    'dump-trailer': { ..., deposit: 500 }
};
```

### **Adjust Damage Waiver Percentage:**
In `step-5-logic.js`, change:
```javascript
damageWaiverCost = Math.round(subtotal * 0.12); // Change 0.12 to desired %
```

---

## ❓ TROUBLESHOOTING

**Issue:** Steps don't connect properly  
**Fix:** Make sure all HTML files are in the same folder

**Issue:** Data not saving between steps  
**Fix:** Check browser allows sessionStorage (not in private mode)

**Issue:** Formspree not receiving submissions  
**Fix:** Verify endpoint URL is correct

**Issue:** Pricing calculator shows wrong amounts  
**Fix:** Check EQUIPMENT and ADDONS objects match in all files

---

## 📞 SUPPORT

**Questions about the code?**  
Review the inline comments in each file.

**Need changes?**  
Let me know what to adjust!

**Ready to deploy?**  
Follow the deployment steps above.

---

## ✅ READY TO LAUNCH CHECKLIST

Before going live:

- [ ] Update phone number (951-555-3478 → your real number)
- [ ] Verify Formspree endpoint
- [ ] Test complete booking flow
- [ ] Test on mobile device
- [ ] Upload to GitHub
- [ ] Deploy to Vercel
- [ ] Point booking.tvdirt.com to Vercel
- [ ] Test live submission
- [ ] **GO LIVE!** 🚀

---

**Your booking system is COMPLETE and ready to use!**

Test it thoroughly, then launch it! 💪
