"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, Calendar, Mail, Phone } from "lucide-react";
import type { Property, Agent, Agency } from "@prisma/client";

interface PropertyAgentProps {
  property: Property & {
    agent?: Agent | null;
    agency?: Agency | null;
  };
}

export default function PropertyAgent({ property }: PropertyAgentProps) {
    console.log("PropertyAgent received:", property);
    if (!property.agent) return null;
    return (
        <div>
            {/* Contact Agent */}
            {property.agent && (
            <Card className="mb-6">
                <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center mb-4">
                    {property.agent.photoUrl ? (
                    <img
                        src={property.agent.photoUrl}
                        alt={property.agent.name ?? "Agent"}
                        className="w-16 h-16 rounded-full mr-4"
                        data-testid="img-agent"
                    />
                    ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        <span className="text-gray-500 font-medium">
                        {property.agent.name?.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                    </div>
                    )}
                    <div>
                    <h4 className="font-semibold text-lg" data-testid="text-agent-name">
                        {property.agent.name}
                    </h4>
                    {property.agency && (
                        <p className="text-gray-600" data-testid="text-agency-name">
                        {property.agency.name}
                        </p>
                    )}
                    {property.agent.specialization && (
                        <p className="text-sm text-gray-500" data-testid="text-agent-specialization">
                        {property.agent.specialization}
                        </p>
                    )}
                    </div>
                </div>

                <div className="space-y-3">
                    {property.agent.phone && (
                    <a
                        href={`tel:${property.agent.phone}`}
                        className="flex items-center text-gray-600 hover:text-primary"
                        data-testid="link-agent-phone"
                    >
                        <Phone className="w-4 h-4 mr-2" />
                        {property.agent.phone}
                    </a>
                    )}
                    {property.agent.email && (
                    <a
                        href={`mailto:${property.agent.email}`}
                        className="flex items-center text-gray-600 hover:text-primary"
                        data-testid="link-agent-email"
                    >
                        <Mail className="w-4 h-4 mr-2" />
                        {property.agent.email}
                    </a>
                    )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">                
                    
                    <Button className="w-full btn-primary" data-testid="button-contact-agent">
                    Contact Agent
                    </Button>
                </div>
                </CardContent>
            </Card>
            )}
        </div>
    )
}
