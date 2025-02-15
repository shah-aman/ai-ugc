"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import Link from "next/link"
import _ from "lodash"
import React from "react"

export function Header() {
    const pathname = usePathname()
    const pathSegments = pathname.split("/").filter(Boolean)

    const formatSegment = (segment: string) => {
        try {
            // Check if the segment looks like a URL
            if (segment.includes('.') || segment.includes('://')) {
                const url = segment.startsWith('http') ? segment : `https://${segment}`
                const parsedUrl = new URL(url)
                // Return just the hostname without 'www.'
                return parsedUrl.hostname.replace(/^www\./, '')
            }
            return _.capitalize(segment)
        } catch {
            // If URL parsing fails, just capitalize the segment
            return _.capitalize(segment)
        }
    }

    const BreadcrumbSegment = ({ segment, href, isLast }: {
        segment: string
        href: string
        isLast: boolean
    }) => {
        const content = formatSegment(segment)
        const truncatedStyle = "max-w-[150px] truncate"

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {isLast ? (
                            <BreadcrumbPage className={truncatedStyle}>
                                {content}
                            </BreadcrumbPage>
                        ) : (
                            <Link
                                href={href}
                                className={`text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${truncatedStyle}`}
                            >
                                {content}
                            </Link>
                        )}
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px] break-words whitespace-normal">
                        {segment}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <header className="bg-background flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {pathSegments.map((segment, index) => {
                            const isLast = index === pathSegments.length - 1
                            const href = `/${pathSegments.slice(0, index + 1).join("/")}`

                            return (
                                <React.Fragment key={segment}>
                                    <BreadcrumbItem>
                                        <BreadcrumbSegment
                                            segment={segment}
                                            href={href}
                                            isLast={isLast}
                                        />
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}