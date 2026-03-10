import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: () => true,
  },
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
      // NO localized — nombre INN es universal
    },
    {
      name: 'categoria',
      type: 'text',
      required: true,
      label: 'Categoría',
      localized: true,
    },
    {
      name: 'sub_categoria',
      type: 'text',
      label: 'Sub-Categoría',
      localized: true,
    },
    {
      name: 'clasificacion_atc',
      type: 'text',
      label: 'Clasificación ATC',
      // NO localized — clasificación universal
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
      localized: true,
    },
    {
      name: 'concentraciones',
      type: 'text',
      label: 'Concentraciones',
      // NO localized — valores numéricos universales
    },
  ],
}


