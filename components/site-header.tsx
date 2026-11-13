import { SignOutButton } from "@/components/auth/sign-out-button";
import { ResponsiveNavMenu } from "@/components/responsive-nav-menu";
import { getServerSession } from "@/lib/auth/server";
import { isAdmin } from "@/lib/authorization";
import { getPublicRouting } from "@/lib/request-routing";

type SiteHeaderProps = {
  appMode?: boolean;
};

export async function SiteHeader({ appMode = false }: SiteHeaderProps) {
  const routing = await getPublicRouting();
  const session = appMode ? await getServerSession() : null;
  const admin = session?.user ? await isAdmin(session.user.id) : false;

  return (
    <header className="site-header shell">
      <nav className="nav">
        <a className="brand" href="/">
          SLPCC63
        </a>
        <ResponsiveNavMenu>
            {appMode ? (
              <>
                <a href={routing.marketingHref}>Marketing Site</a>
                <a href={routing.appHost ? "/time-card-manager" : "/app/time-card-manager"}>Time Card Manager</a>
                {admin ? <span>Administrator</span> : null}
                <SignOutButton />
              </>
            ) : (
              <>
                <a href="#products">Products</a>
                <a href="#filters">Filters</a>
                <a href="/privacy">Privacy</a>
                <a href="/terms">Terms</a>
                <a href={routing.launchProductHref}>App</a>
                <a className="pill primary" href={routing.launchProductHref}>
                  Launch Product
                </a>
              </>
            )}
        </ResponsiveNavMenu>
      </nav>
    </header>
  );
}
