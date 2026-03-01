import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'nombre',
  },
  labels: {
    singular: 'Producto',
    plural: 'Productos',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre del Producto',
    },
    {
      name: 'categoria',
      type: 'text',
      required: true,
      label: 'Categoría',
    },
    {
      name: 'sub_categoria',
      type: 'text',
      label: 'Sub-Categoría',
    },
    {
      name: 'clasificacion_atc',
      type: 'text',
      label: 'Clasificación ATC',
    },
    {
      name: 'activo',
      type: 'checkbox',
      label: 'Activo',
      defaultValue: true,
    },
    {
      name: 'forma_farmaceutica',
      type: 'text',
      label: 'Forma Farmacéutica',
    },
    {
      name: 'concentraciones',
      type: 'text',
      label: 'Concentraciones',
    },
  ],
}

