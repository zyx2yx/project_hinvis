// 获取广度优先遍历的层次结构
function graph_bfs(graph, startNode, maxDepth) {
    const nodes = graph.nodes;
    const links = graph.edges;
    
    let queue = [startNode];
    let visited = new Set();
    let layers = [{ nodes: [startNode], level: 0 }];
    
    while (queue.length > 0 && layers.length <= maxDepth) {
      const currentLayer = layers[layers.length - 1];
      const nextLayer = [];
      const currentLevel = currentLayer.level + 1;
      
      for (const node of currentLayer.nodes) {
        // 获取与当前节点相连的节点
        const neighbors = links.filter(link => link.source === node || link.target === node);
        neighbors.forEach(link => {
          const neighbor = (link.source === node) ? link.target : link.source;
          
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            nextLayer.push(neighbor);
          }
        });
      }
  
      if (nextLayer.length > 0) {
        layers.push({ nodes: nextLayer, level: currentLevel });
        queue = nextLayer;
      }
    }
  
    return layers;
  }

  function convertToHierarchy(graph, startNumID, maxDepth) {
    // 创建一个map来存储numID对应的节点
    const nodeMap = new Map();
    graph.nodes.forEach(node => {
        nodeMap.set(node.numID, node);
    });

    // 创建一个map来存储每个节点的子节点
    const childrenMap = new Map();
    graph.edges.forEach(edge => {
        if (!childrenMap.has(edge.source)) {
            childrenMap.set(edge.source, []);
        }
        childrenMap.get(edge.source).push(edge.target);
    });

    // console.log('nodeMap:', nodeMap, 'childrenMap:', childrenMap);

    // BFS搜索函数，生成层次结构
    function bfs(startNumID, maxDepth) {
        const rootNode = nodeMap.get(startNumID);
        if (!rootNode) return null;

        const result = {
            numID: rootNode.numID,
            id: rootNode.id,
            type: rootNode.type
        };

        const queue = [{ node: rootNode, depth: 0 }];
        const visited = new Set();
        visited.add(startNumID);

        while (queue.length > 0) {
            const { node, depth } = queue.shift();
            if (depth < maxDepth) {
                // 获取当前节点的子节点
                const children = childrenMap.get(node.numID) || [];
                const childNodes = [];
                children.forEach(childNumID => {
                    // 如果子节点没有被访问过，则加入队列
                    if (!visited.has(childNumID)) {
                        visited.add(childNumID);

                        const childNode = nodeMap.get(childNumID);
                        if (childNode) {
                            childNodes.push({
                                numID: childNode.numID,
                                id: childNode.id,
                                type: childNode.type,
                                // children: [] // 默认为空数组，后面会递归添加子节点
                            });
                            queue.push({ node: childNode, depth: depth + 1 });
                        }
                    }
                });

                if (childNodes.length > 0) {
                    // result.children = childNodes;
                    // 在result中递归查找node.numID对应的对象，然后添加children属性
                    const findAndAddChildren = (obj, numID, children) => {
                        if (obj.numID === numID) {
                            obj.children = children;
                        } else if (obj.children) {
                            obj.children.forEach(child => findAndAddChildren(child, numID, children));
                        }
                    };
                    findAndAddChildren(result, node.numID, childNodes);
                    
                }
            }
        }

        return result;
    }

    return bfs(startNumID, maxDepth);
}

// // 示例数据（省略部分节点和边）
// const graph = {
//     nodes: [
//         { numID: 135, id: "Whois_Name_1", type: "Whois_Name" },
//         { numID: 136, id: "Whois_Email_1", type: "Whois_Email" },
//         { numID: 137, id: "Whois_Name_2", type: "Whois_Name" },
//         { numID: 138, id: "Whois_Email_2", type: "Whois_Email" },
//         // 其他节点
//     ],
//     edges: [
//         { source: 135, target: 136, relation: "r_whois_name" },
//         { source: 136, target: 137, relation: "r_whois_email" },
//         { source: 137, target: 138, relation: "r_whois_name" },
//         // 其他边
//     ]
// };

// // 使用该函数进行测试，假设从numID为135的节点出发，最大深度为2
// const result = convertToHierarchy(graph, 135, 4);
// console.log(JSON.stringify(result, null, 2));



export {convertToHierarchy}