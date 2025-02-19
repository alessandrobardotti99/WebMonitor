// app/dashboard/[slug]/page.tsx
import SiteDetailPageClient from "@/components/SiteDetailPageClient";

export async function generateStaticParams() {
  return [
    { slug: 'example-com' }
  ];
}

export default function Page({}: { params: { slug: string } }) {
  return <SiteDetailPageClient />
}
