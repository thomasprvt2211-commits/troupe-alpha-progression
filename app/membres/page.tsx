"use client";

import { useMemo, useState } from "react";
import MemberCard from "@/components/MemberCard";
import MemberDetailModal from "@/components/MemberDetailModal";
import SearchFilters from "@/components/SearchFilters";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { patrols, members } from "@/src/data/troupe-alpha";
import type { Member, RoleFilter } from "@/src/types";
import { Users } from "lucide-react";

export default function MembresPage() {
  const [search, setSearch] = useState("");
  const [patrolFilter, setPatrolFilter] = useState("tous");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("tous");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        search === "" ||
        member.fullName.toLowerCase().includes(search.toLowerCase()) ||
        member.firstName.toLowerCase().includes(search.toLowerCase()) ||
        member.lastName.toLowerCase().includes(search.toLowerCase());

      const matchesPatrol =
        patrolFilter === "tous" || member.patrolId === patrolFilter;

      const matchesRole =
        roleFilter === "tous" || member.role === roleFilter;

      return matchesSearch && matchesPatrol && matchesRole;
    });
  }, [search, patrolFilter, roleFilter]);

  const selectedPatrol = selectedMember
    ? patrols.find((p) => p.id === selectedMember.patrolId)
    : undefined;

  return (
    <div className="section-container py-10 sm:py-14 lg:py-16">
      <PageHeader
        badge="Annuaire"
        title="Membres"
        subtitle={`${members.length} scouts · Recherchez, filtrez et consultez les fiches individuelles`}
      />

      <div className="mb-8">
        <SearchFilters
          search={search}
          onSearchChange={setSearch}
          patrolFilter={patrolFilter}
          onPatrolChange={setPatrolFilter}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          patrols={patrols}
        />
      </div>

      <p className="mb-5 text-sm font-medium text-gray-500">
        {filteredMembers.length} membre{filteredMembers.length > 1 ? "s" : ""} affiché
        {filteredMembers.length > 1 ? "s" : ""}
      </p>

      {filteredMembers.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              patrol={patrols.find((p) => p.id === member.patrolId)}
              onClick={() => setSelectedMember(member)}
              index={index}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Aucun membre trouvé"
          description="Modifiez vos critères de recherche ou de filtre."
        />
      )}

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          patrol={selectedPatrol}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
