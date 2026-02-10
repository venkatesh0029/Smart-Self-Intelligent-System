// Smart Shelf Intelligence System - MongoDB Schema
// Event logging and real-time tracking

db = db.getSiblingDB('ssis_events');

// Create collections
db.createCollection('detection_events', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['event_type', 'timestamp', 'camera_id'],
            properties: {
                event_type: {
                    bsonType: 'string',
                    enum: ['pick', 'return', 'misplace', 'detect', 'missing'],
                    description: 'Type of event detected'
                },
                timestamp: {
                    bsonType: 'date',
                    description: 'Event timestamp'
                },
                camera_id: {
                    bsonType: 'string',
                    description: 'Camera identifier'
                },
                shelf_id: {
                    bsonType: 'string',
                    description: 'Shelf UUID'
                },
                product_id: {
                    bsonType: 'string',
                    description: 'Product UUID'
                },
                object_id: {
                    bsonType: 'int',
                    description: 'Tracking ID from DeepSORT'
                },
                confidence: {
                    bsonType: 'double',
                    minimum: 0,
                    maximum: 1,
                    description: 'Detection confidence score'
                },
                bbox: {
                    bsonType: 'object',
                    properties: {
                        x: { bsonType: 'int' },
                        y: { bsonType: 'int' },
                        width: { bsonType: 'int' },
                        height: { bsonType: 'int' }
                    }
                },
                frame_number: {
                    bsonType: 'int',
                    description: 'Video frame number'
                },
                metadata: {
                    bsonType: 'object',
                    description: 'Additional event metadata'
                }
            }
        }
    }
});

// Create indexes for detection_events
db.detection_events.createIndex({ timestamp: -1 });
db.detection_events.createIndex({ camera_id: 1, timestamp: -1 });
db.detection_events.createIndex({ shelf_id: 1, timestamp: -1 });
db.detection_events.createIndex({ event_type: 1, timestamp: -1 });
db.detection_events.createIndex({ object_id: 1, timestamp: -1 });

// Tracking history collection (for object movement analysis)
db.createCollection('tracking_history');
db.tracking_history.createIndex({ object_id: 1, timestamp: -1 });
db.tracking_history.createIndex({ camera_id: 1, timestamp: -1 });

// Frame snapshots collection (store snapshots of important events)
db.createCollection('frame_snapshots');
db.frame_snapshots.createIndex({ event_id: 1 });
db.frame_snapshots.createIndex({ timestamp: -1 });

// System logs collection
db.createCollection('system_logs');
db.system_logs.createIndex({ timestamp: -1 });
db.system_logs.createIndex({ level: 1, timestamp: -1 });

// Insert sample events
db.detection_events.insertMany([
    {
        event_type: 'detect',
        timestamp: new Date(),
        camera_id: 'CAM-001',
        shelf_id: 'shelf-uuid-1',
        product_id: 'product-uuid-1',
        object_id: 1,
        confidence: 0.92,
        bbox: { x: 100, y: 150, width: 80, height: 120 },
        frame_number: 150,
        metadata: {
            class_name: 'bread',
            position: 'center'
        }
    },
    {
        event_type: 'pick',
        timestamp: new Date(Date.now() - 60000),
        camera_id: 'CAM-001',
        shelf_id: 'shelf-uuid-1',
        product_id: 'product-uuid-1',
        object_id: 1,
        confidence: 0.88,
        bbox: { x: 105, y: 155, width: 75, height: 115 },
        frame_number: 450,
        metadata: {
            class_name: 'bread',
            action: 'picked_by_customer'
        }
    }
]);

// Create time-series collection for real-time metrics (MongoDB 5.0+)
try {
    db.createCollection('shelf_metrics', {
        timeseries: {
            timeField: 'timestamp',
            metaField: 'shelf_id',
            granularity: 'minutes'
        }
    });
    db.shelf_metrics.createIndex({ shelf_id: 1, timestamp: -1 });
} catch (e) {
    print('Time-series collection creation skipped (MongoDB 5.0+ required)');
}

print('MongoDB initialization completed successfully!');