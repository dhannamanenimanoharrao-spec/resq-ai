# RESQ-AI — Adaptive Emergency Resource Orchestration Engine

**Live Demo:** https://resq-ai-liart.vercel.app

## What It Does

RESQ-AI is a real-time emergency response platform that:
- Detects an emergency incident (location, type, severity)
- Evaluates 790 real ambulances across Telangana
- Evaluates 5,166 real health facilities across Telangana
- Recommends the nearest available ambulance and suitable facility
- Displays all resources on a live interactive map with real GPS coordinates
- Tracks dispatch and emergency status end to end

## Real Data Source

All data is sourced from the official Telangana Government GIS portal (TGRAC):
https://tgrac.telangana.gov.in/arcgis/rest/services/GovtHospitals_Folder/Health_Facilities_Query/MapServer

- 5,166 health facility records (Sub Centres, PHCs, Teaching Hospitals, UPHC, BDK)
- 790 ambulance records (EMRI ALS, EMRI BLS, Govt. ALS, Govt. BLS, 102)
- All records include real GPS coordinates, district, mandal, vehicle number, base location

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS + Leaflet (real map)
- Backend: Python + FastAPI + Uvicorn
- Database: Supabase (PostgreSQL)
- Frontend Deploy: Vercel
- Backend Deploy: Railway

## API Endpoints

- GET /ambulances — 790 real Telangana ambulances
- GET /hospitals — 5,166 real Telangana health facilities
- GET /emergencies — all registered emergencies
- POST /emergencies — create new emergency
- POST /dispatch — assign ambulance and facility to emergency

Backend: https://resq-ai-backend-production.up.railway.app

## Key Metrics

- 5,166 health facilities loaded from official GIS data
- 790 ambulances tracked with real GPS base locations
- API response time under 500ms
- Zero fabricated coordinates — all map pins are real locations

## Data Disclaimer

Telangana Government GIS data is used as the geographic and source-data foundation.
This is NOT a live ambulance GPS feed or live hospital bed telemetry system.
Operational status values are application-managed for the hackathon prototype.

## Team

RESQ-AI — Built for SYNESIS Hackathon
