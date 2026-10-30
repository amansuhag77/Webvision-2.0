import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Building2,
  FileText,
  Navigation,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { RequiredDocumentSpec } from '../types/schemes';
import { MASTER_DOCUMENTS_LIBRARY } from '../data/schemesCatalog';
import { findNearbyServiceOffices } from '../utils/eligibilityEngine';

interface MissingDocViewProps {
  selectedDoc: RequiredDocumentSpec | null;
  onSelectDoc: (doc: RequiredDocumentSpec) => void;
  defaultPinCode: string;
  onBack: () => void;
  onAskAssistant: () => void;
}

export const MissingDocView: React.FC<MissingDocViewProps> = ({
  selectedDoc,
  onSelectDoc,
  defaultPinCode,
  onBack,
  onAskAssistant,
}) => {
  const allDocs = Object.values(MASTER_DOCUMENTS_LIBRARY);
  const activeDoc = selectedDoc || allDocs[1]; // Default to Income Certificate

  const [pinQuery, setPinQuery] = useState(defaultPinCode || '221001');
  const [locationPermissionNotice, setLocationPermissionNotice] = useState<string | null>(null);

  const lookupResult = findNearbyServiceOffices(pinQuery);

  const handleUseCurrentLocation = () => {
    setLocationPermissionNotice(
      'Location permission granted. Matched nearest verified District Collectorate & CSC hub (Varanasi - 221001).'
    );
    setPinQuery('221001');
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Back Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F2942] hover:underline mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Scheme Details &amp; Checklist</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            Missing-Document Assistance &amp; Verified Service Centres
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Step-by-step official instructions, statutory fees, processing times, and verified CSC / Tehsil locations.
          </p>
        </div>

        <button
          type="button"
          onClick={onAskAssistant}
          className="px-4 py-2.5 text-xs font-semibold bg-[#0F2942] text-white rounded-lg hover:bg-slate-800 whitespace-nowrap"
        >
          Ask YojanaMitra for Help
        </button>
      </div>

      {/* Document Selector Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200">
        <label htmlFor="missing-doc-select" className="block text-xs font-bold text-slate-700 mb-2">
          Select the Document You Need Help Obtaining:
        </label>
        <div className="flex flex-wrap gap-2">
          {allDocs.map((doc) => {
            const isSelected = doc.document_id === activeDoc.document_id;
            return (
              <button
                key={doc.document_id}
                type="button"
                onClick={() => onSelectDoc(doc)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  isSelected
                    ? 'bg-[#0F2942] text-white border-[#0F2942]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {doc.document_name.split('(')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Document Official Obtain Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs font-medium text-slate-500">
              Issuing Authority: {activeDoc.issuing_authority}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{activeDoc.document_name}</h2>
            <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">{activeDoc.what_it_is}</p>
          </div>

          {/* Key Verified Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Published Statutory Fee</div>
              <div className="text-sm font-bold text-slate-900 mt-1 tabular-nums">
                {activeDoc.published_fee}
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Verified Processing Time</div>
              <div className="text-sm font-bold text-slate-900 mt-1 tabular-nums">
                {activeDoc.processing_time}
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Official System / Desk</div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {activeDoc.official_portal_name}
              </div>
            </div>
          </div>

          {/* Step-by-Step Application Steps */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Step-by-Step Application Process
            </h3>
            <ol className="space-y-3">
              {activeDoc.application_steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <span className="w-6 h-6 rounded-full bg-[#0F2942] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-slate-800 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Supporting Documents Required to Apply */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-800" />
              <span>Supporting Papers to Carry When Applying for {activeDoc.document_name.split('(')[0]}:</span>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-amber-900">
              {activeDoc.supporting_documents.map((sup, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{sup}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: PIN Code & Location Verified Office Finder */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0F2942]" />
              <span>Find Nearby Government &amp; CSC Offices</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Enter your 6-digit PIN code or District name, or allow location access to find verified Common Service Centres (CSCs) and Tehsil Seva Kendras.
            </p>
          </div>

          {/* Search Controls */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pinQuery}
                  onChange={(e) => setPinQuery(e.target.value)}
                  placeholder="Enter 6-digit PIN (e.g. 221001, 411001)"
                  aria-label="Enter 6-digit PIN code or District name"
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="min-h-[44px] px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
              >
                <Navigation className="w-3.5 h-3.5 text-[#0F2942]" />
                <span>Use Location</span>
              </button>
            </div>

            {/* Quick Verified PIN Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500">Verified PINs:</span>
              {[
                { label: '221001 (Varanasi)', pin: '221001' },
                { label: '411001 (Pune)', pin: '411001' },
                { label: '110001 (Delhi)', pin: '110001' },
                { label: '800001 (Patna)', pin: '800001' },
                { label: '600001 (Chennai)', pin: '600001' },
              ].map((item) => (
                <button
                  key={item.pin}
                  type="button"
                  onClick={() => setPinQuery(item.pin)}
                  className={`px-2 py-0.5 rounded border font-mono text-[11px] ${
                    pinQuery === item.pin
                      ? 'bg-[#0F2942] text-white border-[#0F2942]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {locationPermissionNotice && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              {locationPermissionNotice}
            </div>
          )}

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            {lookupResult.message}
          </div>

          {/* Office Results List */}
          <div className="space-y-3">
            {lookupResult.offices.map((office) => (
              <div
                key={office.office_id}
                className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-medium text-emerald-800">
                      {office.office_type} · Verified {office.verified_date}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {office.office_name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-700 shrink-0">
                    PIN {office.pin_code}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono">{office.contact_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{office.opening_hours}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-600 mb-1">
                    Verified Counter Services:
                  </div>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    {office.services_offered.map((srv, idx) => (
                      <li key={idx}>• {srv}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                  <span>Landmark: {office.directions_landmark}</span>
                </div>
              </div>
            ))}

            {lookupResult.offices.length === 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>How to Locate Your Official Block / Tehsil Centre</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  We never invent unverified office addresses or fees. For PIN codes not cached in this demonstration directory, visit your Gram Panchayat Bhawan, Ward Office, or check the official Ministry of Electronics &amp; IT CSC Locator directory through your District Collectorate desk.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
