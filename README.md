# Intent Drift Dashboard

A web-based learning analytics system that analyzes student behavior and detects changes in learning intent over time using engagement metrics.

---

## Overview

The **Intent Drift Dashboard** goes beyond traditional activity tracking by analyzing behavioral patterns in learner data.  
It helps instructors identify disengagement early and take action using clear, explainable insights.

---

## Problem

Most learning management systems:
- Track clicks and time spent
- Do NOT capture actual engagement or intent
- Provide raw data without meaningful insights

Result: Instructors detect struggling students too late.

---

## Solution

This project provides a full-stack dashboard that:

- Processes learner activity data (backend)
- Computes behavioral engagement metrics
- Visualizes trends and patterns (frontend)
- Generates actionable insights for instructors

---

## Core Metrics

The system evaluates learners using the following metrics:

- **Engagement Depth**  
  Measures how deeply a student interacts with content  

- **Early Exit Rate**  
  Tracks how often students leave sessions early  

- **Difficulty Avoidance**  
  Identifies preference for easier content  

- **Completion Consistency**  
  Measures how regularly tasks are completed  

- **Effort Consistency**  
  Tracks stability of effort across sessions  

- **Engagement Trend**  
  Indicates whether engagement is improving, declining, or stable over time  

---

## Key Features

-  Class-level and learner-level analytics  
-  Filtering and search functionality  
-  Risk classification (Disengaged, Early Exit Pattern, etc.)  
-  Engagement timeline visualization  
-  Real-time metric computation  

---

## Tech Stack

**Frontend**
- React
- Vite

**Backend**
- Node.js
- Express

**Database**
- SQLite (via Prisma)

---

## Testing & Evaluation

The system was evaluated using **Google Lighthouse**, analyzing:

- Performance  
- Accessibility  
- Best Practices  
- SEO  

Results indicate a well-optimized and efficient frontend implementation.

---

## Why Not AI / Machine Learning?

This project uses deterministic logic instead of AI because:

- Ensures full transparency and explainability  
- Easier for instructors to understand results  
- Works reliably with smaller datasets  
- Avoids black-box decision making  

---

## Pros & Limitations

### Pros
- Clear and explainable insights  
- Lightweight and fast  
- Easy to use interface  

### Limitations
- No predictive capabilities  
- Depends on input data quality  
- Limited dataset (simulated data)  

---

## 🔮 Future Scope

- Integration of machine learning for predictions  
- Real-time alerts for instructors  
- Integration with LMS platforms  
- Mobile optimization  

---
