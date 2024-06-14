import React, { useState, useEffect, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import CPMApi from '../../services/api/CPMApi';
import { Activity } from '../../models/cpm/Activity';
import NumberOfActivitiesModal from './NumberOfActivitiesModal';
import { Gantt, Task } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import ReactFlow, { Node, Edge } from 'react-flow-renderer';
import '../../App.css';
import '../../styles/CPM.css';

const CPM: React.FC = () => {
    const [numberOfActivities, setNumberOfActivities] = useState<number>(1);
    const [showModal, setShowModal] = useState<boolean>(true);
    const [dependencyValues, setDependencyValues] = useState<string[]>(Array(numberOfActivities).fill(''));
    const [durations, setDurations] = useState<number[]>(Array(numberOfActivities).fill(0));
    const [showCalculatedActivities, setShowCalculatedActivities] = useState<boolean>(false);
    const [calculatedActivities, setCalculatedActivities] = useState<Activity[]>([]);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showCriticalPath, setShowCriticalPath] = useState<boolean>(false);
    const [criticalPath, setCriticalPath] = useState<string[]>([]);
    const [criticalPathDuration, setCriticalPathDuration] = useState<number>(0);
    const [showActivityGraph, setShowActivityGraph] = useState<boolean>(false);
    const [showGanttChart, setShowGanttChart] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [graphElements, setGraphElements] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });

    const handleSaveModal = () => {
        setShowModal(false);
    };

    const handleNumberOfActivitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setNumberOfActivities(value);
            setDurations(Array(value).fill(0));
            setDependencyValues(Array(value).fill(''));
        } else {
            setNumberOfActivities(1);
            setDurations([0]);
            setDependencyValues(['']);
        }
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newDurations = [...durations];
        newDurations[index] = parseInt(e.target.value);
        setDurations(newDurations);

        const updatedActivities = calculatedActivities.map((activity, i) => {
            if (i === index) {
                return { ...activity, duration: parseInt(e.target.value) };
            }
            return activity;
        });
        setCalculatedActivities(updatedActivities);
    };

    const handleDependencyChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = e.target.value.trim().toUpperCase();

        if (newValue.includes(' ')) {
            setAlertMessage('Dependency Name field cannot contain spaces.');
            setShowAlert(true);
            return;
        }

        if (newValue.length > 1 && !newValue.includes(',')) {
            setAlertMessage('Dependency Name field must have commas (",") between characters.');
            setShowAlert(true);
            return;
        }

        const newDependencies = [...dependencyValues];
        newDependencies[index] = newValue;
        setDependencyValues(newDependencies);
    };

    const handleCalculate = async () => {
        const areFieldsFilled = dependencyValues.every(value => value.trim() !== '') && durations.every(duration => duration >= 0);

        if (!areFieldsFilled) {
            setAlertMessage('All text fields are required.');
            setShowAlert(true);
            return;
        }

        const activities: Activity[] = [];
        for (let i = 0; i < numberOfActivities; i++) {
            let dependencyNames: string[] = [];
            if (dependencyValues[i].trim() !== '-') {
                dependencyNames = dependencyValues[i].trim().split(',').map(dep => dep.trim()).filter(Boolean);
            }
            const activity: Activity = {
                id: i + 1,
                name: String.fromCharCode(65 + i),
                duration: durations[i],
                earlyStart: 0,
                earlyFinish: 0,
                lateStart: 0,
                lateFinish: 0,
                slackTime: 0,
                isCriticalActivity: 'No',
                childList: [],
                parentList: [],
                dependencyNames: dependencyNames,
            };
            activities.push(activity);
        }
        CPMApi.sendAndProcessData(activities, setCalculatedActivities, setShowCalculatedActivities, setAlertMessage, setShowAlert);
    };

    const handleShowCriticalPath = async () => {
        try {
            const criticalPathNames = await CPMApi.fetchCriticalPath(calculatedActivities);
            setCriticalPath(criticalPathNames);
            setShowCriticalPath(true);

            try {
                const duration = await CPMApi.fetchCriticalPathDuration(calculatedActivities);
                setCriticalPathDuration(duration);
            } catch (error) {
                console.error('Error:', error);
                setAlertMessage('Error occurred while fetching critical path duration.');
                setShowAlert(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage('Error occurred while fetching critical path.');
            setShowAlert(true);
        }
    };

    const generateTable = () => {
        const rows = [];
        for (let i = 0; i < numberOfActivities; i++) {
            rows.push(
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{String.fromCharCode(65 + i)}</td>
                    <td style={{ textAlign: 'center' }}>
                        <Form.Control
                            type="text"
                            size="sm"
                            style={{ width: '150px', margin: 'auto' }}
                            value={dependencyValues[i]}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDependencyChange(e, i)}
                            className="form-control"
                            required
                        />
                    </td>
                    <td style={{ textAlign: 'center' }}>
                        <Form.Control
                            type="number"
                            size="sm"
                            style={{ width: '100px', margin: 'auto' }}
                            value={durations[i]}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDurationChange(e, i)}
                            className="form-control"
                            min="0"
                            required
                        />
                    </td>
                </tr>
            );
        }
        return rows;
    };

    const generateGraph = useCallback(() => {
        const nodes: Node[] = calculatedActivities.map((activity, index) => {

            const isCritical = activity.isCriticalActivity === 'Yes';
            const labelStyle = { fontSize: '16px' }; // Styl dla całej etykiety
            const nameStyle = { fontSize: '20px', fontWeight: 'bold' };

            const x = (index + 1) * 200; // Odstęp między węzłami w poziomie
            const y = Math.random() * 500;
            return {
                id: activity.id.toString(),
                data: {
                    label: (
                        <div style={labelStyle}>
                            <div style={nameStyle}>{activity.name}</div>
                            Duration: {activity.duration}<br />
                            Early Start: {activity.earlyStart}<br />
                            Early Finish: {activity.earlyFinish}<br />
                            Slack Time: {activity.slackTime}
                        </div>
                    )
                },
                position: { x, y },
                style: {
                    backgroundColor: isCritical ? '#FF8080' : '#CCCCCC'
                }
            };
        });

        const edges: Edge[] = [];
        calculatedActivities.forEach(activity => {
            activity.dependencyNames.forEach(dependencyName => {
                const dependencyActivity = calculatedActivities.find(a => a.name === dependencyName);
                if (dependencyActivity) {
                    edges.push({
                        id: `${dependencyActivity.id}-${activity.id}`,
                        source: dependencyActivity.id.toString(),
                        target: activity.id.toString(),
                        label: activity.duration.toString()
                    });
                }
            });
        });

        setGraphElements({ nodes: nodes, edges: edges });
        return { nodes, edges };
    }, [calculatedActivities]);


    const handleNodeDrag = (event: React.MouseEvent<Element>, node: Node) => {
        if (node.type === 'default') {
            const updatedNodes = graphElements.nodes.map((n: Node) => {
                if (n.id === node.id) {
                    const offsetX = event.nativeEvent.offsetX;
                    const offsetY = event.nativeEvent.offsetY;

                    return {
                        ...n,
                        position: {
                            x: n.position.x + offsetX,
                            y: n.position.y + offsetY
                        }
                    };
                }
                return n;
            });
            setGraphElements({ ...graphElements, nodes: updatedNodes }); // Aktualizacja stanu węzłów
        }
    };

    const generateGanttChart = useCallback(() => {
        const newTasks: Task[] = calculatedActivities.map(activity => {
            const progressColor = activity.isCriticalActivity === 'Yes' ? '#bf0000' : '#000000';
            const progressSelectedColor = progressColor;

            const dependencyIds: string[] = [];

            activity.dependencyNames.forEach(dependencyName => {
                const dependencyActivity = calculatedActivities.find(a => a.name === dependencyName && a.id !== activity.id);
                if (dependencyActivity) {
                    dependencyIds.push(dependencyActivity.id.toString());
                }
            });

            const dependencies = dependencyIds.length > 0 ? [...dependencyIds, activity.id.toString()] : [];

            return {
                ...activity,
                start: new Date(2024, 0, activity.earlyStart + 1),
                end: new Date(2024, 0, activity.earlyFinish + 1),
                name: activity.name.toString(),
                id: activity.id.toString(),
                dependencies: dependencies,
                type: 'task',
                progress: 100,
                isDisabled: true,
                styles: { progressColor, progressSelectedColor },
            };
        });
        setTasks(newTasks);
    }, [calculatedActivities]);

    const handleGenerateGraph = useCallback(() => {
        setShowActivityGraph(true);
        generateGraph();
    }, [generateGraph]);

    const handleGenerateGanttChart = useCallback(() => {
        setShowGanttChart(true);
        generateGanttChart();
    }, [generateGanttChart]);

    useEffect(() => {
        if (showActivityGraph) {
            generateGraph();
        }
        if (showGanttChart) {
            generateGanttChart();
        }
    }, [showActivityGraph, showGanttChart, generateGraph, generateGanttChart]);

    return (
        <div className="CPM">
            <h1>CPM issue</h1>
            <h3>Enter activity information below</h3>
            <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                {alertMessage}
            </Alert>
            <NumberOfActivitiesModal
                showModal={showModal}
                handleSaveModal={handleSaveModal}
                handleNumberOfActivitiesChange={handleNumberOfActivitiesChange}
                numberOfActivities={numberOfActivities}
            />
            <div className="activity-table">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Activity Name</th>
                            <th>Dependency Name (format: -,A,B,C...)</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generateTable()}
                    </tbody>
                </table>
                <Button variant="danger" onClick={handleCalculate}>Calculate</Button>
            </div>

            {showCalculatedActivities && (
                <div className="calculated-activities">
                    <h3>Calculated activities</h3>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Activity Name</th>
                                <th>Duration</th>
                                <th>Early Start</th>
                                <th>Early Finish</th>
                                <th>Late Start</th>
                                <th>Late Finish</th>
                                <th>Slack Time</th>
                                <th>Critical Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {calculatedActivities.map((activity, index) => (
                                <tr key={index}>
                                    <td>{activity.id}</td>
                                    <td>{activity.name}</td>
                                    <td>{activity.duration}</td>
                                    <td>{activity.earlyStart}</td>
                                    <td>{activity.earlyFinish}</td>
                                    <td>{activity.lateStart}</td>
                                    <td>{activity.lateFinish}</td>
                                    <td>{activity.slackTime}</td>
                                    <td>{activity.isCriticalActivity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Button variant="danger" onClick={handleShowCriticalPath}>Show Critical Path</Button>
                </div>
            )}

            {showCriticalPath && (
                <div className="critical-path">
                    <h3>Critical Path</h3>
                    <span className="critical-path-letters">
                        {criticalPath.map((activityName, index) => (
                            <span key={index}>
                                {activityName}
                                {index < criticalPath.length - 1 && ' -> '}
                            </span>
                        ))}
                    </span>
                    <p></p>
                    <h3>Duration</h3>
                    <span className="critical-path-duration-letters">
                        {criticalPathDuration}
                    </span>
                    <p></p>
                    <Button variant="dark" onClick={handleGenerateGraph}>Generate Graph</Button>
                </div>
            )}

            {showActivityGraph && (
                <div className="activity-graph">
                    <h3>Activity Graph</h3>
                    <div style={{ width: '100%', height: '600px' }}>
                        <ReactFlow onNodeDragStart={handleNodeDrag} {...graphElements} style={{ width: '130%', height: '600px' }} />
                    </div>
                    <Button variant="dark" onClick={handleGenerateGanttChart}>Generate Gantt Chart</Button>
                </div>
            )}

            {showGanttChart && (
                <div className="gantt-chart">
                    <h3>Gantt Chart</h3>
                    <h5>Critical path highlighted in <b>RED</b> color</h5>
                    <Gantt tasks={tasks} />
                </div>
            )}
        </div>
    );
}

export default CPM;