'use client';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import Column from '../Column/Column';
import TaskCard from '../TaskCard/TaskCard';
import useBoard, { UseBoardProps } from './useBoard';

export default function Board(props: UseBoardProps) {
  const { state, actions, helpers } = useBoard(props);
  const { sensors, activeTask, columns } = state;
  const { getTasks, handleDragStart, handleDragOver, handleDragEnd } = actions;
  const { closestCorners } = helpers;

  const scrollContainerClasses =
    props.mode === 'my-day'
      ? 'w-full overflow-x-auto overflow-y-visible p-4 touch-pan-x snap-x snap-mandatory lg:overflow-x-visible'
      : 'w-full overflow-x-auto p-4 touch-pan-x snap-x snap-mandatory';

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={scrollContainerClasses}>
        <div className="flex w-full min-w-full gap-4">
          {columns.map(col => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={getTasks(col.id)}
              mode={props.mode}
              status={col.status}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            dragOverlay
            mode={props.mode}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
