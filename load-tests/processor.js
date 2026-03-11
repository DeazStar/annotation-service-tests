module.exports = {
    generatePayload,
    waitForCompletion
};

// Helper: Generate random Node ID (matches your python logic)
function generateNodeId() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const firstChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 52));
    let restChars = '';
    for (let i = 0; i < 10; i++) {
        restChars += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return firstChar + restChars;
}

function generatePayload(context, events, done) {
    // We define the 4 queries here
    const queries = [
        // --- Query 1: Simple single gene ---
        () => {
            const q1_node1 = generateNodeId();
            return {
                name: "Query 1: Simple (CROCCP3)",
                payload: {
                    requests: {
                        nodes: [{ node_id: q1_node1, id: "", type: "gene", properties: { gene_name: "CROCCP3" } }],
                        predicates: []
                    }
                }
            };
        },

        // --- Query 2: IGF1 with transcript, protein, exon ---
        () => {
            const n1 = generateNodeId(), n2 = generateNodeId(), n3 = generateNodeId(), n4 = generateNodeId();
            return {
                name: "Query 2: IGF1 Medium",
                payload: {
                    requests: {
                        nodes: [
                            { node_id: n1, id: "", type: "gene", properties: { gene_name: "IGF1" } },
                            { node_id: n2, id: "", type: "transcript", properties: {} },
                            { node_id: n3, id: "", type: "protein", properties: {} },
                            //{ node_id: n4, id: "", type: "exon", properties: {} }
                        ],
                        predicates: [
                            { predicate_id: generateNodeId(), type: "transcribed_from", source: n2, target: n1 },
                            { predicate_id: generateNodeId(), type: "translates_to", source: n2, target: n3 },
                            //{ predicate_id: generateNodeId(), type: "includes", source: n2, target: n4 }
                        ]
                    }
                }
            };
        },

        // --- Query 3: IGF1 with pathways and TAD ---
        () => {
            const n1 = generateNodeId(), n2 = generateNodeId(), n3 = generateNodeId(), n4 = generateNodeId();
            return {
                name: "Query 3: IGF1 Pathways",
                payload: {
                    requests: {
                        nodes: [
                            { node_id: n1, id: "", type: "gene", properties: { gene_name: "IGF1" } },
                            { node_id: n2, id: "", type: "pathway", properties: {} },
                            { node_id: n3, id: "", type: "pathway", properties: {} },
                            { node_id: n4, id: "", type: "tad", properties: {} }
                        ],
                        predicates: [
                            { predicate_id: generateNodeId(), type: "genes_pathways", source: n1, target: n2 },
                            { predicate_id: generateNodeId(), type: "child_pathway_of", source: n3, target: n2 },
                            { predicate_id: generateNodeId(), type: "in_tad_region", source: n1, target: n4 }
                        ]
                    }
                }
            };
        },

        //// --- Query 4: Complex Pathway ---
        () => {
            const n1 = generateNodeId(), n2 = generateNodeId(), n3 = generateNodeId(), n4 = generateNodeId(), n5 = generateNodeId();
            return {
                name: "Query 4: Complex",
                payload: {
                    requests: {
                        nodes: [
                            {
                                node_id: "aZaDXDJEjFw",
                                id: "",
                                type: "gene",
                                properties: {
                                    gene_name: "BRCA2"
                                }
                            },
                            {
                                node_id: "aYXWRRxQBMN",
                                id: "",
                                type: "transcript",
                                properties: {}
                            },
                            {
                                node_id: "aJCuFsXtDDG",
                                id: "",
                                type: "protein",
                                properties: {}
                            },
                            {
                                node_id: "aUrcYASglAn",
                                id: "",
                                type: "pathway",
                                properties: {}
                            },
                            // {
                            //   node_id: "afcWggktrTB",
                            //   id: "",
                            //   type: "protein",
                            //   properties: {}
                            // }
                        ],
                        predicates: [
                            {
                                predicate_id: "JGjZQCeiTk",
                                type: "transcribed to",
                                source: "aZaDXDJEjFw",
                                target: "aYXWRRxQBMN"
                            },
                            {
                                predicate_id: "ptmiucZALr",
                                type: "translates to",
                                source: "aYXWRRxQBMN",
                                target: "aJCuFsXtDDG"
                            },
                            // {
                            //   predicate_id: "QSkayanJiI",
                            //   type: "interacts with",
                            //   source: "afcWggktrTB",
                            //   target: "aJCuFsXtDDG"
                            // },
                            {
                                predicate_id: "JVETIrSdrt",
                                type: "genes pathways",
                                source: "aZaDXDJEjFw",
                                target: "aUrcYASglAn"
                            }
                        ]
                    }
                }
            }
        },

        () => {
            const n1 = generateNodeId(), n2 = generateNodeId(), n3 = generateNodeId(), n4 = generateNodeId(), n5 = generateNodeId();
            return {
                name: "Query 4: Complex",
                payload: {
                    requests: {
                        nodes: [
                            {
                                node_id: "n1",
                                id: "",
                                type: "promoter",
                                properties: {}
                            },
                            {
                                node_id: "n2",
                                id: "",
                                type: "gene",
                                properties: {
                                    gene_name: "IGF2"
                                }
                            },
                            {
                                node_id: "n3",
                                id: "",
                                type: "enhancer",
                                properties: {}
                            },
                            {
                                node_id: "n4",
                                id: "",
                                type: "pathway",
                                properties: {}
                            },
                            {
                                node_id: "n5",
                                id: "",
                                type: "pathway",
                                properties: {}
                            }
                        ],
                        predicates: [
                            {
                                predicate_id: "p1",
                                type: "associated with",
                                source: "n1",
                                target: "n2"
                            },
                            {
                                predicate_id: "p2",
                                type: "associated with",
                                source: "n3",
                                target: "n2"
                            },
                            {
                                predicate_id: "p3",
                                type: "genes pathways",
                                source: "n2",
                                target: "n4"
                            },
                            {
                                predicate_id: "p4",
                                type: "child pathway of",
                                source: "n5",
                                target: "n4"
                            }
                        ]
                    }
                }
            }
        },
        //() => {
        //  const n1 = generateNodeId(), n2 = generateNodeId(), n3 = generateNodeId(), n4 = generateNodeId(), n5 = generateNodeId();
        //  return {
        //    name: "Query 5: Complex",
        //    payload: {
        //      requests: {
        //        nodes: [
        //          {
        //            node_id: "n1",
        //            id: "",
        //            type: "gene",
        //            properties: {}
        //          },
        //          {
        //            node_id: "n2",
        //            id: "",
        //            type: "transcript",
        //            properties: {}
        //          },
        //          {
        //            node_id: "n3",
        //            id: "",
        //            type: "exon",
        //            properties: {}
        //          },
        //          {
        //            node_id: "n4",
        //            id: "",
        //            type: "protein",
        //            properties: {
        //              protein_name: "1433B"
        //            }
        //          },
        //          {
        //            node_id: "n5",
        //            id: "",
        //            type: "protein",
        //            properties: {}
        //          },
        //          {
        //            node_id: "n6",
        //            id: "",
        //            type: "go",
        //            properties: {}
        //          }
        //        ],
        //        predicates: [
        //          {
        //            predicate_id: "p1",
        //            type: "transcribed to",
        //            source: "n1",
        //            target: "n2"
        //          },
        //          {
        //            predicate_id: "p2",
        //            type: "includes",
        //            source: "n2",
        //            target: "n3"
        //          },
        //          {
        //            predicate_id: "p3",
        //            type: "translation of",
        //            source: "n4",
        //            target: "n2"
        //          },
        //          {
        //            predicate_id: "p5",
        //            type: "interacts with",
        //            source: "n4",
        //            target: "n5"
        //          },
        //          {
        //            predicate_id: "p6",
        //            type: "go gene product",
        //            source: "n6",
        //            target: "n4"
        //          }
        //        ]
        //      }
        //    }
        //  }
        //},

        () => {
            return {
                name: "Query 6: Complex",
                payload: {
                    requests: {
                        nodes: [
                            {
                                node_id: "n1",
                                id: "",
                                type: "transcript",
                                properties: {
                                    gene_name: "TP73-AS1"
                                }
                            },
                            {
                                node_id: "n2",
                                id: "",
                                type: "exon",
                                properties: {}
                            },
                            {
                                node_id: "n3",
                                id: "",
                                type: "gene",
                                properties: {
                                }
                            }
                        ],
                        predicates: [
                            {
                                predicate_id: "p1",
                                type: "includes",
                                source: "n1",
                                target: "n2"
                            },
                            {
                                predicate_id: "p2",
                                type: "transcribed_from",
                                source: "n1",
                                target: "n3"
                            }
                        ]
                    }
                }
            }
        }
    ];

    // Pick one random query
    const selected = queries[Math.floor(Math.random() * queries.length)]();

    // Set variables for the YAML to use
    context.vars.payload = selected.payload;
    context.vars.queryName = selected.name;

    // Start the timer for this specific virtual user
    context.vars.startTime = Date.now();

    return done();
}

/**
 * This function handles the "Listen and Wait" logic.
 * It is purely event-driven.
 */
function waitForCompletion(context, events, done) {
    // --- FIX START ---
    // In mixed scenarios, the socket is stored in context.sockets.
    // The default namespace is an empty string "".
    let socket = context.sockets[""];

    // Fallback: If using a custom namespace (e.g. /admin), it might be under that key.
    // If undefined, try to grab the first available socket.
    if (!socket && context.sockets) {
        const socketKeys = Object.keys(context.sockets);
        if (socketKeys.length > 0) {
            socket = context.sockets[socketKeys[0]];
        }
    }

    if (!socket || !socket.on) {
        console.error("❌ ERROR: No active Socket.IO connection found in context.sockets");
        return done(new Error("No active socket connection"));
    }
    // --- FIX END ---

    // Safety timeout (fail after 60s)
    const timeoutHandle = setTimeout(() => {
        if (socket.off) {
            socket.off('socket_event', listener);
            socket.off('update', listener);
        }
        done(new Error('Timeout waiting for COMPLETE status'));
    }, 40 * 60 * 1000);

    // The Listener
    const listener = (data) => {
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch (e) { }
        }

        // Log status (helpful for debugging)
        // console.log(`[${context.vars.queryName}] Status: ${data.status}`);

        if (data.update.graph === true) {
            clearTimeout(timeoutHandle);
            socket.off('socket_event', listener);
            socket.off('update', listener);

            // --- PERFORMANCE TRACKING ---
            const duration = Date.now() - context.vars.startTime;
            // This creates a custom metric in your Artillery report
            events.emit('histogram', `latency_${context.vars.queryName}`, duration);
            return done();
        }
        else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
            clearTimeout(timeoutHandle);
            socket.off('socket_event', listener);
            socket.off('update', listener);
            return done(new Error(`Server returned ${data.status}`));
        }
    };

    // Listen
    socket.on('update', listener);
    //socket.on('socket_event', listener);
}