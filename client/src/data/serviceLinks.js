import { seed } from './seedData.js'
import { slugify } from '../utils/slugify.js'

export const serviceNavLinks = seed.services.map((service) => ({
  label: service.service_name,
  to: `/services/${slugify(service.service_name)}`,
}))

export function serviceDetailPath(serviceName) {
  return `/services/${slugify(serviceName)}`
}
