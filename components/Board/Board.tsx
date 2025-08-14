'use client';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import Column from '../Column';
import TaskCard from '../TaskCard';
import useBoard, { UseBoardProps } from './useBoard';

export default function Board(props: UseBoardProps) {
  const { state, actions, helpers } = useBoard(props);
  const { sensors, activeTask, columns } = state;
  const { getTasks, handleDragStart, handleDragOver, handleDragEnd } = actions;
  const { closestCorners } = helpers;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto p-4">
        {columns.map(col => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={getTasks(col.id)}
            mode={props.mode}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            dragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
