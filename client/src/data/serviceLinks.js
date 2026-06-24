// Builds navigation links for services from seed data
import { seed } from './seedData.js'

// Used in navbar dropdown and footer
export const serviceNavLinks = seed.services.map((service) => ({
  label: service.service_name,
  to: `/services/${service.service_id}`,
}))

// Helper to link to a single service detail page
export function serviceDetailPath(serviceId) {
  return `/services/${serviceId}`
}
