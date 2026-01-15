import React from "react";
import { Card } from "./card";
import { Input } from "./input";
import { Button } from "./button";
import { Badge } from "./badge";
import { Search } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface FilterGroup {
  label: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  selectedValue: string | null;
  onChange: (value: string | null) => void;
}

interface SearchAndFilterProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterGroups?: FilterGroup[];
  onClearAll?: () => void;
  activeFilters?: { label: string; value: string }[];
  resultsCount?: {
    filtered: number;
    total: number;
  };
}

/**
 * Reusable search and filter component
 * Provides a consistent UI for searching and filtering content
 */
export function SearchAndFilter({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filterGroups = [],
  onClearAll,
  activeFilters = [],
  resultsCount,
}: SearchAndFilterProps) {
  const hasActiveFilters = searchValue || filterGroups.some(g => g.selectedValue !== null);

  return (
    <>
      <Card className="p-4 sm:p-6 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Groups */}
          {filterGroups.map((group, index) => (
            <div key={index}>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                {group.icon}
                {group.label}:
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={group.selectedValue === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => group.onChange(null)}
                >
                  All
                </Button>
                {group.options.map((option) => (
                  <Button
                    key={option.value}
                    variant={group.selectedValue === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => group.onChange(option.value)}
                  >
                    {option.icon && <span className="mr-1">{option.icon}</span>}
                    {option.label}
                    {option.count !== undefined && ` (${option.count})`}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2 border-t flex-wrap">
              <p className="text-sm text-muted-foreground">Active filters:</p>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {filter.label}: {filter.value}
                </Badge>
              ))}
              {onClearAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Results Count */}
      {resultsCount && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {resultsCount.filtered} of {resultsCount.total} results
          </p>
        </div>
      )}
    </>
  );
}
