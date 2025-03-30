# Dashboard Component

The Dashboard component provides farmers with a comprehensive view of their business metrics, activities, and quick access to key features.

## Features

- **Stats Cards**: Display key metrics like total sales, active orders, inventory items, and customer base.
- **Quick Actions**: Provide one-click access to common tasks such as adding products, processing orders, and managing storage.
- **Recent Activities**: Show latest actions and events on the platform with appropriate status indicators.
- **Upcoming Deliveries**: Display scheduled deliveries with customer information and status.
- **Inventory Status**: Visual representation of inventory levels for different products.
- **Storage Status**: Monitor cold storage and warehouse usage with visual indicators.

## Styling

The Dashboard uses the following key styling elements:

- CSS Grid layouts (`dashboard-grid-2`, `dashboard-grid-4`) for responsive card arrangements.
- Card components with consistent styling (`card-dashboard`, `stats-card`).
- Status pills for visual status indication (`status-active`, `status-pending`, `status-inactive`).
- Gradient backgrounds for visual hierarchy (`bg-gradient-primary`, `bg-gradient-secondary`).
- Fade-in animations with staggered delays for a dynamic loading experience.
- Progress bars for visualizing capacity and inventory levels.
- Consistent spacing and typography that follows the application's design system.

## Customization

The Dashboard component can be customized by:

1. Adding new stat cards or quick action buttons as needed.
2. Connecting to real API data sources instead of using hardcoded mock data.
3. Adjusting the layout grid for different screen sizes.
4. Adding additional sections like charts or calendars as needed.

## Related Components

The Dashboard connects with other key components in the application:

- ColdStorage: For managing storage bookings
- BulkBuy: For handling bulk purchasing and negotiations
- Orders: For tracking and managing orders
- Products: For managing product inventory 