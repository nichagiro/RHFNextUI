/* eslint-disable @typescript-eslint/no-explicit-any */

import { faker } from '@faker-js/faker';
import { format } from '@formkit/tempo';

interface iRows {
  id: string;
  service: string;
  topic: string;
  date: string;
  hour: string;
  status: string;
  subRows?: any
}

export const fakerRows = (): iRows[] => Array.from({ length: 20 }, (_, a) => {
  const data: iRows = {
    service: faker.person.jobArea(),
    topic: faker.lorem.paragraphs(),
    hour: format(faker.date.anytime(), 'HH:mm'),
    date: format(faker.date.anytime(), 'DD/MM/YYYY'),
    status: faker.helpers.arrayElement(["Activo", "Inactivo"]),
    id: (a + 1).toString(),
  }
  
  if (faker.helpers.arrayElement(["Activo", "Inactivo"]) === "Activo") {
    data.subRows = Array.from({ length: faker.helpers.rangeToNumber({ min: 5, max: 10 }) }, () => ({
      service: faker.person.jobArea(),
      topic: faker.commerce.department(),
      hour: format(faker.date.anytime(), 'HH:mm'),
      date: format(faker.date.anytime(), 'DD/MM/YYYY'),
      status: faker.helpers.arrayElement(["Activo", "Inactivo"]),
      id: faker.string.nanoid(),
    }))
  }
  
  return data
})

export const fakerUsers = () => Array.from({ length: 20 }, () => ({
  key: faker.string.nanoid(),
  label: faker.person.firstName()
}))


