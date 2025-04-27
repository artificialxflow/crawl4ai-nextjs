'use client'

import { useState } from 'react'
import styles from './FieldSelector.module.css'

interface Field {
  name: string
  description: string
}

interface FieldSelectorProps {
  fields: Field[]
  onFieldsChange: (fields: Field[]) => void
}

export default function FieldSelector({ fields, onFieldsChange }: FieldSelectorProps) {
  const [newField, setNewField] = useState<Field>({ name: '', description: '' })
  const [error, setError] = useState('')

  const handleAddField = () => {
    if (!newField.name.trim() || !newField.description.trim()) {
      setError('Both name and description are required')
      return
    }

    if (fields.some(field => field.name === newField.name)) {
      setError('A field with this name already exists')
      return
    }

    onFieldsChange([...fields, newField])
    setNewField({ name: '', description: '' })
    setError('')
  }

  const handleRemoveField = (name: string) => {
    onFieldsChange(fields.filter(field => field.name !== name))
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Extraction Fields</h2>
      
      <div className={styles.addField}>
        <input
          type="text"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
          placeholder="Field name"
          className={styles.input}
        />
        <input
          type="text"
          value={newField.description}
          onChange={(e) => setNewField({ ...newField, description: e.target.value })}
          placeholder="Field description"
          className={styles.input}
        />
        <button
          onClick={handleAddField}
          className={styles.addButton}
        >
          Add Field
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.fieldsList}>
        {fields.map((field) => (
          <div key={field.name} className={styles.fieldItem}>
            <div className={styles.fieldContent}>
              <span className={styles.fieldName}>{field.name}</span>
              <span className={styles.fieldDescription}>{field.description}</span>
            </div>
            <button
              onClick={() => handleRemoveField(field.name)}
              className={styles.removeButton}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 