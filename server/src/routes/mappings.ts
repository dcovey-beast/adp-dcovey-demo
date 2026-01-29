import { Router } from 'express';
import { FieldMapping } from '../types';

const router = Router();

// In-memory storage for mappings
let mappings: FieldMapping[] = [];

// GET /api/mappings - Get all field mappings
router.get('/', (req, res) => {
  res.json(mappings);
});

// POST /api/mappings - Create a new field mapping
router.post('/', (req, res) => {
  const mapping: FieldMapping = {
    id: 'map-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
    addeparEntity: req.body.addeparEntity,
    addeparField: req.body.addeparField,
    salesforceObject: req.body.salesforceObject,
    salesforceField: req.body.salesforceField,
    syncDirection: req.body.syncDirection || 'bidirectional',
    conflictResolution: req.body.conflictResolution || 'addepar-wins',
    createdAt: new Date().toISOString(),
  };
  
  mappings.push(mapping);
  res.status(201).json(mapping);
});

// PUT /api/mappings/:id - Update a field mapping
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = mappings.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Mapping not found' });
  }
  
  mappings[index] = {
    ...mappings[index],
    syncDirection: req.body.syncDirection || mappings[index].syncDirection,
    conflictResolution: req.body.conflictResolution || mappings[index].conflictResolution,
  };
  
  res.json(mappings[index]);
});

// DELETE /api/mappings/:id - Delete a field mapping
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = mappings.findIndex(m => m.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Mapping not found' });
  }
  
  mappings.splice(index, 1);
  res.json({ success: true });
});

export default router;
