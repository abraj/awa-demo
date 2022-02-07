import React from 'react';
import styles from './drag-n-drop.module.css'
import common from '../../styles/common.module.css';
import { Link } from 'react-router-dom';

class DragDropDemo extends React.Component<DragDropDemoProps, DragDropDemoState> {
  state: DragDropDemoState;
  tasksListRef: React.RefObject<HTMLDivElement>;

  constructor(props: DragDropDemoProps) {
    super(props);

    this.state = {
      error: false,
      tasks: [
        { id: 't1', taskName: 'Task Item 1', type: 'inProgress' },
        { id: 't2', taskName: 'Task Item 2', type: 'inProgress' },
        { id: 't3', taskName: 'Task Item 3', type: 'inProgress' },
        { id: 't4', taskName: 'Task Item 4', type: 'done' },
        { id: 't5', taskName: 'Task Item 5', type: 'done' },
	    ],
      taskItems: [
        { id: 'i1', taskName: 'List Item 1' },
        { id: 'i2', taskName: 'List Item 2' },
        { id: 'i3', taskName: 'List Item 3' },
        { id: 'i4', taskName: 'List Item 4' },
        { id: 'i5', taskName: 'List Item 5' },
	    ],
      draggingTaskId: null,
      dropTarget1: false,
      dropTarget2: false,
      dropActive1: false,
      dropActive2: false,
      draggingTaskId3: null,
      itemsY: null,
      atIndex: -1,
    };

    this.tasksListRef =  React.createRef<HTMLDivElement>();
  }

  componentDidMount() {
    window.onscroll = () => {
      if (this.state.draggingTaskId3) {
        this.updateItemsY();
      }
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

  updateItemsY = () => {    
    if (this.tasksListRef.current) {
      const el = this.tasksListRef.current;
      const outerRect = el.getBoundingClientRect();

      const items = Array.from(el.children);
      const itemsY = items.map(item => {
        const rect = item.getBoundingClientRect();        
        return rect.y + (rect.height * 0.1);
      });

      itemsY.push(outerRect.bottom);
      this.setState({ itemsY });
    }
  };

  onDragStart3 = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {    
    e.dataTransfer.setData('taskId', taskId);
    this.setState({ draggingTaskId3: taskId });
    this.updateItemsY();
  };

  onDragComplete3 = () => {
    // Include delay so that `atIndex` is read by `onDrop3()` before reset.
    setTimeout(() => {
      this.setState({
        draggingTaskId3: null,
        itemsY: null,
        atIndex: -1,
      });      
    }, 50);
  };

  onDragOver3 = (e: React.DragEvent<HTMLDivElement>) => {
    // Enable dropping inside an element (disabled by default)
    e.preventDefault();

    if (this.state.itemsY) {
      let atIndex = -1;
      let atMin = Number.POSITIVE_INFINITY;
      this.state.itemsY.forEach((y, i) => {
        const yc = Math.abs(y - e.clientY);
        if (yc < atMin) {
          atMin = yc;
          atIndex = i;
        }
      });
      if (this.state.atIndex !== atIndex) {
        this.setState({ atIndex });
      }
    }
	};

  onDrop3 = (e: React.DragEvent<HTMLDivElement>) => {
    // Ensure reset since `onDragEnd()` of dragged item not called when it's being (re)moved
    this.onDragComplete3();

    const taskId = e.dataTransfer.getData('taskId');
    const { taskItems, atIndex } = this.state;

    let currIndex = -1;
    taskItems.forEach((task, i) => {
      if (task.id === taskId) {
        currIndex = i;
      }
    });

    if (currIndex < 0 || atIndex === currIndex || atIndex === currIndex + 1) {
      // no-op
    } else if (currIndex >= 0 && atIndex >= 0) {
      const item = taskItems.splice(currIndex, 1);
      if (atIndex < currIndex) {
        taskItems.splice(atIndex, 0, item[0]);
      } else {
        taskItems.splice(atIndex - 1, 0, item[0]);
      }
    }
    
    this.setState({ taskItems });
	};

  render() {
    const { error, tasks, draggingTaskId, dropTarget1, dropTarget2, dropActive1, dropActive2 } = this.state;
    const { taskItems, draggingTaskId3, atIndex } = this.state;

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

    const reorderTasks: any = [];

    taskItems.forEach((task, i) => {
      const draggingItem = task.id === draggingTaskId3 ? styles.draggingItem3 : '';
      const showDropGuide = !!draggingTaskId3 && atIndex === i;
      const dropGuideActive = showDropGuide ? styles.dropGuideActive : '';

      reorderTasks.push(
        <div key={task.id}>
          <div className={`${styles.dropGuide} ${dropGuideActive}`}>&nbsp;</div>
          <div
            draggable
            onDragStart={e => this.onDragStart3(e, task.id)}
            onDragEnd={() => this.onDragComplete3()}
            className={`${styles.draggableItem} ${styles.draggableItem3} ${draggingItem}`}
          >
            <div>
              {task.taskName}
            </div>
          </div>
        </div>
      );      
    });

    const showDropGuide = !!draggingTaskId3 && atIndex === taskItems.length;
    const dropGuideActive = showDropGuide ? styles.dropGuideActive : '';
    reorderTasks.push(
      <div key="last-drop-guide">
        <div className={`${styles.lastDropGuide} ${dropGuideActive}`}>&nbsp;</div>
      </div>
    );

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
            <div className={styles.sectionInfo}>You can move the task items by dragging them from <em>In-Progress</em> to <em>Done</em>, or vice-versa.</div>
            <div className={styles.dragContainer}>
              <div>
                <div className={styles.groupTitle}>In Progress</div>
                <div
                  className={`${styles.taskItems} ${inProgressItemsActive} ${inProgressDropRegion}`}
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
                  className={`${styles.taskItems} ${doneItemsActive} ${doneDropRegion}`}
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
          <div>
            <div className={styles.sectionTitle}>Reorder List</div>
            <div className={styles.sectionInfo}>You can reorder the list items by dragging them <em>upwards</em> or <em>downwards</em>.</div>
            <div className={styles.dragContainer}>
              <div
                className={styles.taskItems}
                onDragOver={e => this.onDragOver3(e)}
                onDrop={e => this.onDrop3(e)}
                style={{ padding: '6px' }}
              >
                <div ref={this.tasksListRef} className={styles.bucketList} style={{ gap: '4px' }}>
                  {reorderTasks}
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
  taskItems: TaskItem2[];
  draggingTaskId: string | null;
  dropTarget1: boolean;
  dropTarget2: boolean;
  dropActive1: boolean;
  dropActive2: boolean;
  draggingTaskId3: string | null;
  itemsY: number[] | null;
  atIndex: number;
}

interface TaskItem {
  id: string;
  taskName: string;
  type: string;
}

interface TaskItem2 {
  id: string;
  taskName: string;
}

// Ref:
// * https://www.pluralsight.com/guides/implement-drag-drop-react-component
// * https://www.youtube.com/watch?v=jfYWwQrtzzY
