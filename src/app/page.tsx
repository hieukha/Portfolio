import PortfolioPage from "@/components/PortfolioPage";
import GlobalChatWidget from "@/components/GlobalChatWidget";
import { getPortfolioData } from "@/lib/portfolio-data";

export default async function Home() {
  const data = await getPortfolioData();
  return (
    <>
      <PortfolioPage data={data} />
      <GlobalChatWidget />
    </>
  );
}
