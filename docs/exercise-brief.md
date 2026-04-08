# Turbo AI: Product Manager Challenge

> **Source:** [Notion page](https://colorful-herring-b52.notion.site/Turbo-AI-Product-Manager-Challenge-23215e42e6a28074856be9b94009bfb0)
> **Exported:** 2026-04-07

---

## Welcome

Thank you for participating in Turbo AI's hiring process! We're so excited to learn more about how you think, how you approach ambiguous challenges, and how you use design and product thinking to bring ideas to life.

---

## The Challenge

You're stepping into the role of a Product Manager at Turbo AI. Your mission: help one of our founders bring their idea to life.

This challenge simulates a real client engagement. You'll take a fuzzy vision from a non-technical founder and turn it into something clear, scoped, and buildable — just like we do every day at Turbo AI.

### The Situation

Alex runs a medical supply distribution company currently managing patient orders through a complex Excel spreadsheet. She wants to build a web-based internal tool to replace it.

### Your Goals

Alex's vision is scattered and incomplete. Your job is to:

1. **Understand the real problem** — What does Alex actually need vs. what she thinks she wants?
2. **Propose a phased approach** — Break the full vision into 2-week sprints (assume you're working with one full-stack engineer)
3. **Design Sprint 1** — Create a prototype of something the team will actually love using
4. **Present to the client** — Record a video sharing your proposal with the client

---

## The Deliverables

### 1. Clickable Prototype (provide the link)
- Design a high-fidelity, interactive prototype that covers the features in your Sprint 1 plan.
- Don't prototype the entire system. Focus on making Sprint 1 feel real, polished, and well thought-through.

### 2. 10-Minute Video (provide a link — YouTube or Loom)
Record a video presenting your proposal to Alex as if this were a real client checkpoint. Your video should cover:

- **Phasing and Roadmap:** How you broke the vision into phases. Show us how you prioritize and sequence work to deliver value quickly.
- **Sprint 1 Deep Dive:** Present the specific problem Sprint 1 solves and your proposed solution. Explain the key decisions you made and what you're explicitly not building yet.
- **Prototype Walkthrough:** Demo your clickable prototype and walk through the key flows. Show us how this improves the team's workflow.
- **How you used AI tools for this challenge:** Briefly tell us how you used AI during this challenge.

---

## Key Constraints

- **Time Limit:** You will have **72 hours** to complete the challenge from the moment you receive it. Get as far as you can in those 72 hours.
- **Using AI is encouraged:** We welcome and encourage you to use **AI tools** to enhance and speed up your process. Please, let us know in your written deliverable what tools you used and how you used them.

---

## Evaluation Criteria

| Criteria | What They're Looking For |
|----------|-------------------------|
| **Client Communication** | Did you present clearly, confidently, and build trust through your communication? |
| **Product Thinking & Scoping** | Did you identify the real problem? Can you break complex work into smart phases that deliver value quickly? |
| **Design Execution & Quality** | Does your prototype show strong design judgment and attention to detail? Would this genuinely improve the team's workflow? |
| **Creativity & Tool Usage** | Did you bring fresh thinking and use AI tools in smart, impactful ways? |

---

## Submission

When you're done, send your deliverable to camila@turbotime.io

---

## Client Conversation (Transcript)

> The following is the transcript of the initial discovery conversation between Camila (Turbo AI) and Alex (the client/founder).

---

**Alex:**

Hey, I'm Alex. I just got back from my honeymoon — I'm still a little jet-lagged and all over the place, so forgive me if I sound scattered. I've been trying to get this product out of Excel and into something more functional.

Right now, we manage all of our patient orders and billing flows inside a huge Excel spreadsheet. It's basically an intake form for when a clinic sends us an order for a specific patient. But it's become too complex to scale, and I'm looking for a more customizable, web-based tool where my team can input orders and generate the documents we need.

**Camila:**

Got it. So this is for your internal team — not something you're building as a product for others?

**Alex:**

Exactly. It's just for us. But even though it's not customer-facing, I still want it to be clean, well-organized, and easy to use. If we're going to invest in a system, I want something that actually makes our team's day-to-day smoother. We're a medical supply distributor that works with physical therapy clinics treating lymphedema and breast cancer patients. A therapist sends us an order for their patient. We collect all the documentation, do insurance verifications, submit prior authorizations if needed, place the order with the vendor, and manage billing. We drop ship everything to the patient and get paid by insurance.

**Camila:**

And the spreadsheet helps your team track and calculate all of that?

**Alex:**

Yeah — but it's a beast. You enter the patient info, insurance, shipping address, and product details. Then we calculate our margin, cost per unit, billable amounts, and what the patient owes. Some of the logic depends on the vendor, product type, state, or payer. It pulls from three or four hidden tables — like fee schedules and product databases — to calculate everything. But it's fragile. If one field breaks, the whole sheet goes haywire.

**Camila:**

What's your goal for replacing it?

**Alex:**

I want a system that makes this process easier and less error-prone for our team. Ideally, we'd have two tables: one for products (with costs, vendors, and categories) and one for fee schedules (with payer rates and multipliers). Then, when an employee fills out the form, most fields would auto-populate. All they'd need to enter is the patient info and select the items from a dropdown.

The system should also generate three documents we rely on:

1. **The encounter form** — an internal document used to summarize the order.
2. **The patient invoice** — which we send out via DocuSign with a Stripe payment link.
3. **The proof of delivery (POD)** — which gets emailed to the patient after they receive their order, and must be signed.

**Camila:**

What's the flow after an order is entered?

**Alex:**

First, the employee fills out the form. In some cases, certain HCPCS codes require a manager's approval before proceeding — we currently manage that via SharePoint and a manual approval flow. After approval, we save the documents as PDFs, upload them to the patient's record in our internal system, and send the invoice and consent via DocuSign.

If the patient pays, we go to the vendor portal and manually place the order. Then we send them the proof of delivery to sign.

**Camila:**

Would you want to automate sending those emails?

**Alex:**

That's the dream. If the system could detect the vendor and send the order automatically to the right email — for example, if it's a Medi product, send the order to Medi — that would save a lot of time. Right now, our team has to re-enter everything manually in the vendor portals, even though the info is already in the spreadsheet.

**Camila:**

Any other important features?

**Alex:**

Yes — two things:

- Some products require **measurement forms** from the therapist. We should be able to upload those per line item.
- Some patients are **self-pay**, so the price should default to the MSRP from the vendor catalog.

Also, I'd love to eventually track whether certain items require prior authorization. We know that internally, but it's not written anywhere yet.
