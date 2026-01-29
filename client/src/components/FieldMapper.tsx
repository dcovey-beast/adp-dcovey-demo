import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { Badge } from './ui/badge';
import {
  useAddeparEntities,
  useSalesforceMetadata,
  useMappings,
  useCreateMapping,
  useDeleteMapping,
} from '../hooks/useQuery';
import { ArrowRight, ArrowLeft, ArrowLeftRight, Trash2, GripVertical } from 'lucide-react';
import { FieldMapping } from '../types/integration';

function DraggableField({ id, label, type }: { id: string; label: string; type: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex items-center justify-between p-3 bg-secondary rounded-md cursor-move hover:bg-secondary/80 transition-colors"
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="font-medium text-sm">{label}</div>
          <div className="text-xs text-muted-foreground">{type}</div>
        </div>
      </div>
    </div>
  );
}

function DroppableField({ id, label, type }: { id: string; label: string; type: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-between p-3 rounded-md border-2 border-dashed transition-colors ${
        isOver ? 'border-primary bg-primary/10' : 'border-border bg-background'
      }`}
    >
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{type}</div>
      </div>
    </div>
  );
}

export function FieldMapper() {
  const [selectedEntity, setSelectedEntity] = useState('Household');
  const { data: entities } = useAddeparEntities();
  const { data: metadata, refetch: refetchMetadata } = useSalesforceMetadata();
  const { data: mappings } = useMappings();
  const createMapping = useCreateMapping();
  const deleteMapping = useDeleteMapping();

  useEffect(() => {
    refetchMetadata();
  }, [refetchMetadata]);

  const currentEntity = entities?.find((e) => e.type === selectedEntity);
  const salesforceObjects = metadata?.objects || [];

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const [addeparField] = active.id.toString().split('::');
    const [salesforceObject, salesforceField] = over.id.toString().split('::');

    await createMapping.mutateAsync({
      addeparEntity: selectedEntity,
      addeparField,
      salesforceObject,
      salesforceField,
      syncDirection: 'bidirectional',
      conflictResolution: 'addepar-wins',
    });
  };

  const handleDeleteMapping = async (id: string) => {
    await deleteMapping.mutateAsync(id);
  };

  const getSyncDirectionIcon = (direction: FieldMapping['syncDirection']) => {
    switch (direction) {
      case 'toSalesforce':
        return <ArrowRight className="h-4 w-4" />;
      case 'toAddepar':
        return <ArrowLeft className="h-4 w-4" />;
      case 'bidirectional':
        return <ArrowLeftRight className="h-4 w-4" />;
    }
  };

  const entityMappings = mappings?.filter((m) => m.addeparEntity === selectedEntity) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Field Mapping</h2>
        <p className="text-muted-foreground mt-2">
          Drag Addepar fields to Salesforce fields to create mappings
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Select Entity Type</label>
        <Select value={selectedEntity} onChange={(e) => setSelectedEntity(e.target.value)}>
          {entities?.map((entity) => (
            <option key={entity.type} value={entity.type}>
              {entity.label}
            </option>
          ))}
        </Select>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {/* Addepar Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Addepar Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {currentEntity?.attributes.map((attr) => (
                  <DraggableField
                    key={attr.name}
                    id={`${attr.name}::${attr.label}`}
                    label={attr.label}
                    type={attr.type}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mappings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Mappings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {entityMappings.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No mappings yet. Drag a field to create one.
                  </p>
                ) : (
                  entityMappings.map((mapping) => (
                    <div
                      key={mapping.id}
                      className="p-3 border rounded-md bg-card space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{mapping.addeparField}</div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getSyncDirectionIcon(mapping.syncDirection)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {mapping.salesforceObject}.{mapping.salesforceField}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMapping(mapping.id)}
                        className="w-full text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Salesforce Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Salesforce Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {salesforceObjects.map((object) => (
                  <div key={object.name} className="space-y-2">
                    <h4 className="font-semibold text-sm text-primary">{object.label}</h4>
                    <div className="space-y-2 pl-2">
                      {object.fields.map((field) => (
                        <DroppableField
                          key={`${object.name}::${field.name}`}
                          id={`${object.name}::${field.name}`}
                          label={field.label}
                          type={field.type}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DndContext>
    </div>
  );
}
