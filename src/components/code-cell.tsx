import './code-cell.css';
import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles![cell.id]);
  const cumulativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells!;
    const retval = [];

    for (let cellId of order) {
      const { type, content } = data[cellId];

      if (type === 'code') {
        retval.push(content);
      }

      if (cell.id === cellId) {
        break;
      }
    }

    return retval;
  });
  console.log(cumulativeCode);
  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode.join('\n'));
      return;
    }

    const timer = setTimeout(() => {
      createBundle(cell.id, cumulativeCode.join('\n'));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createBundle, cell.id, cumulativeCode.join('\n')]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: 'calc(100% - 10px)', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction='horizontal'>
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        {
          !bundle || bundle.loading ? (
            <div className="progress-wrapper">
              <div className="progress-cover">
                <progress className="progress is-small is-primary" max="100">
                  Loading
                </progress>
              </div>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )
        }
      </div>
    </Resizable>
  );
};

export default CodeCell;
