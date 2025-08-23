import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function AgencySearchFilters({
  searchTerm,
  setSearchTerm,
  specializationFilter,
  setSpecializationFilter,
  sortBy,
  setSortBy,
  uniqueSpecializations,
}: any) {
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-2 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search agencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          data-testid="input-search-agencies"
        />
      </div>

      <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
        <SelectTrigger data-testid="select-specialization">
          <SelectValue placeholder="All Specializations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Specializations</SelectItem>
          {uniqueSpecializations.map(
            (spec: string | null) =>
              spec && (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              )
          )}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger data-testid="select-sort">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rating">Highest Rated</SelectItem>
          <SelectItem value="name">Name A-Z</SelectItem>
          <SelectItem value="listings">Most Listings</SelectItem>
          <SelectItem value="sales">Most Sales</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
