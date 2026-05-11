import { AppRoutes } from "../../../routes/AppRoutes";

/**
 * MainLayout is now a thin shell — each route handles its own layout
 * (PublicLayout, DashboardLayout, or AuthLayout).
 *
 * The old Header/Menu/Footer are no longer rendered here; they've been
 * replaced by the per-route layouts in src/layouts/.
 */
export function MainLayout(): JSX.Element {
    return <AppRoutes />;
}