import React from 'react';
import styles from './drag-n-drop.module.css'
import common from '../../styles/common.module.css';
import { Link } from 'react-router-dom';

class DragDropDemo extends React.Component<DragDropDemoProps, DragDropDemoState> {
  state: DragDropDemoState;

  constructor(props: DragDropDemoProps) {
    super(props);
    this.state = {
      error: false,
      tasks: [
        { id: '1', taskName: 'Action Item 1', type: 'inProgress' },
        { id: '2', taskName: 'Action Item 2', type: 'inProgress' },
        { id: '3', taskName: 'Action Item 3', type: 'inProgress' },
        { id: '4', taskName: 'Action Item 4', type: 'done' },
        { id: '5', taskName: 'Action Item 5', type: 'done' },
	    ],
      draggingTaskId: null,
      dropTarget1: false,
      dropTarget2: false,
      dropActive1: false,
      dropActive2: false,
    };
  }

  onDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string, taskType: string) => {    
    e.dataTransfer.setData('taskId', taskId);
    this.setState({ draggingTaskId: taskId });

    if (taskType === 'inProgress') {
      this.setState({ dropTarget2: true });    
    } else if (taskType === 'done') {
      this.setState({ dropTarget1: true });    
    }
  };

  onDragComplete = () => {
    this.setState({
      draggingTaskId: null,
      dropTarget1: false,
      dropTarget2: false,
      dropActive1: false,
      dropActive2: false
    });
  };

  onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Enable dropping inside an element (disabled by default)
    e.preventDefault();
	};

  onDragEnter1 = (e: React.DragEvent<HTMLDivElement>) => {
    if (this.state.dropTarget1 && !this.state.dropActive1) {
      this.setState({ dropActive1: true });
    }
	};

  onDragEnter2 = (e: React.DragEvent<HTMLDivElement>) => {
    if (this.state.dropTarget2 && !this.state.dropActive2) {
      this.setState({ dropActive2: true });
    }
	};

  onDragLeave1 = (e: React.DragEvent<HTMLDivElement>) => {
    if (this.state.dropTarget1 && this.state.dropActive1) {
      this.setState({ dropActive1: false });
    }
	};

  onDragLeave2 = (e: React.DragEvent<HTMLDivElement>) => {
    if (this.state.dropTarget2 && this.state.dropActive2) {
      this.setState({ dropActive2: false });
    }
	};

  onDrop = (e: React.DragEvent<HTMLDivElement>, type: string) => {
    this.onDragComplete();
    const taskId = e.dataTransfer.getData('taskId');

    const tasks = this.state.tasks.map((task) => {
      if (task.id === taskId) {          
          task.type = type;
      }
      return task;
    });
    
    this.setState({ tasks });
	};

  render() {
    const { error, tasks, draggingTaskId, dropTarget1, dropTarget2, dropActive1, dropActive2 } = this.state;

    const buckets: any = {
      inProgress: [],
      done: []
    };

    tasks.forEach(task => {
      const draggingItem = task.id === draggingTaskId ? styles.draggingItem : '';      

      buckets[task.type]?.push(
        <div key={task.id}
          draggable
          onDragStart={e => this.onDragStart(e, task.id, task.type)}
          onDragEnd={() => this.onDragComplete()}
		      className={`${styles.draggableItem} ${draggingItem}`}
        >
          <div>
  		      {task.taskName}
          </div>
		    </div>
      );      
    });

    /**
     * The .dropActive classes created dashed border on hovering drop region while dragging.
     * However, onDragEnter and onDragLeave events work for the `whole` container only when
     * `pointer-events: none` is applied in css for all children (*). However, doing so permanently
     * removes mouse coursor styles (like `move` cursor in this case). So, we apply the css
     * `pointer-events: none` on-the-fly on the target container children (*) when the drag starts
     * and remove it when the drag finishes (onDragEnd or onDrop events).
     */
    const inProgressDropRegion = dropTarget1 ? styles.activeDropRegion : '';
    const doneDropRegion = dropTarget2 ? styles.activeDropRegion : '';
    const inProgressItemsActive = dropActive1 ? styles.inProgressItemsActive : '';
    const doneItemsActive = dropActive2 ? styles.doneItemsActive : '';

    return (
      <div className={common.container}>
        <div className={common.title}>Drag and Drop API Demo</div>
        <div className={common.body}>
          {error && (
            <div className={common.errorMsg}>This browser is not supported!</div>
          )}

          {error && (
            <div className={common.errorMsg}>Something went wrong! Check permissions.</div>
          )}

          <br />
          <div>
            <div className={styles.sectionTitle}>To Do List</div>
            <div className={styles.dragContainer}>
              <div>
                <div className={styles.groupTitle}>In Progress</div>
                <div
                  className={`${styles.inProgressItems} ${inProgressItemsActive} ${inProgressDropRegion}`}
                  onDragOver={e => this.onDragOver(e)}
                  onDrop={e => this.onDrop(e, 'inProgress')}
                  onDragEnter={e => this.onDragEnter1(e)}
                  onDragLeave={e => this.onDragLeave1(e)}
                >
                  <div className={styles.bucketList}>
                    {buckets.inProgress.length ? buckets.inProgress : (
                      <div className={styles.metaText1}>Woohoo! All caught up! &nbsp;🎉</div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.groupTitle}>Done</div>
                <div
                  className={`${styles.doneItems} ${doneItemsActive} ${doneDropRegion}`}
                  onDragOver={e => this.onDragOver(e)}
                  onDrop={e => this.onDrop(e, 'done')}
                  onDragEnter={e => this.onDragEnter2(e)}
                  onDragLeave={e => this.onDragLeave2(e)}
                >
                  <div className={styles.bucketList}>
                    {buckets.done.length ? buckets.done : (
                      <div className={styles.metaText2}>You better get to work! 😡</div>
                    )}
                  </div>
                </div>
              </div>
	          </div>
          </div>

          <br />
          <a href="https://github.com/abraj/awa-demo/tree/main/src/demo/drag-n-drop">Source code</a>
          <br />
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API">Drag and Drop API documentation</a>

          <br /><br />
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    )
  }
};

export default DragDropDemo;

export interface DragDropDemoProps {}

export interface DragDropDemoState {
  error: boolean;
  tasks: TaskItem[];
  draggingTaskId: string | null;
  dropTarget1: boolean;
  dropTarget2: boolean;
  dropActive1: boolean;
  dropActive2: boolean;
}

interface TaskItem {
  id: string;
  taskName: string;
  type: string;
}

// Ref:
// * https://www.pluralsight.com/guides/implement-drag-drop-react-component
