"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface AddressAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (address: { street: string; city: string; zipCode: string; country: string }) => void;
    placeholder?: string;
    country?: string;
    className?: string;
    disabled?: boolean;
}

export default function AddressAutocomplete({
    value,
    onChange,
    onSelect,
    placeholder,
    country = "France",
    className,
    disabled
}: AddressAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSuggestions = async (query: string) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            let url = "";
            if (country === "France") {
                url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=10`;
            } else {
                // Fallback to Photon (OSM) for international
                url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`;
            }

            const res = await fetch(url);
            if (!res.ok) {
                setSuggestions([]);
                return;
            }

            const data = await res.json();
            const features = data?.features;

            if (!Array.isArray(features)) {
                setSuggestions([]);
                return;
            }

            const mapped = features.map((f: any) => {
                if (country === "France") {
                    return {
                        label: f.properties?.label || "",
                        street: f.properties?.name || "",
                        city: f.properties?.city || "",
                        zipCode: f.properties?.postcode || "",
                        context: f.properties?.context || ""
                    };
                } else {
                    return {
                        label: `${f.properties?.name || ""}${f.properties?.street ? " " + f.properties.street : ""}, ${f.properties?.postcode || ""} ${f.properties?.city || ""}, ${f.properties?.country || ""}`.replace(/^, /, "").trim(),
                        street: f.properties?.name || f.properties?.street || "",
                        city: f.properties?.city || "",
                        zipCode: f.properties?.postcode || "",
                        context: f.properties?.country || ""
                    };
                }
            });

            setSuggestions(mapped);
            setIsOpen(true);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        onChange(val);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            fetchSuggestions(val);
        }, 300);
    };

    const handleSelect = (s: any) => {
        onSelect({
            street: s.street,
            city: s.city,
            zipCode: s.zipCode,
            country: country
        });
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => !disabled && value.length >= 3 && setIsOpen(true)}
                    placeholder={placeholder}
                    className={className}
                    autoComplete="off"
                    disabled={disabled}
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 text-ely-blue animate-spin" />
                    </div>
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-y-auto max-h-60 animate-in fade-in slide-in-from-top-2 duration-200">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleSelect(s)}
                            className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                            <div className="mt-1 p-1.5 bg-ely-blue/5 text-ely-blue rounded-lg">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900 text-sm">{s.label}</div>
                                <div className="text-xs text-gray-400 mt-0.5">{s.context}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
