import React from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { Cell } from '../state/cell';
import AddCell from './add-cell';
import CellListItem from './cell-list-item';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells }) => {
    if (!cells) {
      return [] as Cell[];
    }

    const { order, data } = cells;
    return order.map((id) => data[id]);
  });

  const renderedCells = cells.map(cell => {
    return (
      <React.Fragment key={cell.id}>
        <CellListItem cell={cell} />
        <AddCell previousCellId={cell.id} />
      </React.Fragment>
    );
  });

  return (
    <div>
      <AddCell previousCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
