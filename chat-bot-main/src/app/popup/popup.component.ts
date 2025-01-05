// import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
// import { MAT_DIALOG_DATA,MatDialogRef  } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import * as d3 from 'd3';

// interface Node extends d3.SimulationNodeDatum {
//   id: string;
//   name: string;
//   type: string;
// }

// interface Link extends d3.SimulationLinkDatum<Node> {
//   source: string | Node;
//   target: string | Node;
//   relationship: string;
// }

// @Component({
//   selector: 'app-popup',
//   templateUrl: './popup.component.html',
//   styleUrls: ['./popup.component.css'],
//   standalone: true,
//   imports: [CommonModule]
// })
// export class PopupComponent implements OnInit {
//   @ViewChild('container', { static: true }) container!: ElementRef;

//   private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
//   private width!: number;
//   private height!: number;
//   private simulation!: d3.Simulation<Node, Link>;

  // private nodes: Node[] = [
  //   { id: 'A', name: 'Node A', type: 'Person' },
  //   { id: 'B', name: 'Node B', type: 'Organization' },
  //   { id: 'C', name: 'Node C', type: 'Event' },
  //   { id: 'D', name: 'Node D', type: 'Person' },
  //   { id: 'E', name: 'Node E', type: 'Organization' },
  //   { id: 'F', name: 'Node F', type: 'Event' },
  //   { id: 'G', name: 'Node G', type: 'Person' },
  //   { id: 'H', name: 'Node H', type: 'Organization' }
  // ];

  // private links: Link[] = [
  //   { source: 'A', target: 'B', relationship: 'Works for' },
  //   { source: 'B', target: 'C', relationship: 'Organizes' },
  //   { source: 'C', target: 'D', relationship: 'Attended by' },
  //   { source: 'D', target: 'E', relationship: 'Member of' },
  //   { source: 'E', target: 'F', relationship: 'Sponsors' },
  //   { source: 'F', target: 'G', relationship: 'Hosted by' },
  //   { source: 'G', target: 'H', relationship: 'Consults for' },
  //   { source: 'H', target: 'A', relationship: 'Employs' },
  //   { source: 'A', target: 'D', relationship: 'Friends with' },
  //   { source: 'B', target: 'E', relationship: 'Partners with' },
  //   { source: 'C', target: 'F', relationship: 'Related to' }
  // ];

//   constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<PopupComponent>) {

//     console.log('Popup Data:', data);
//   }

//   ngOnInit() {
//     this.createGraph();
//   }

//   private createGraph() {
//     const element = this.container.nativeElement;
//     this.width = element.clientWidth || 700;
//     this.height = element.clientHeight || 700;

//     this.svg = d3.select(this.container.nativeElement)
//       .append('svg')
//       .attr('width', this.width)
//       .attr('height', this.height);

//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     // Create force simulation
//     this.simulation = d3.forceSimulation<Node>(this.nodes)
//       .force('link', d3.forceLink<Node, Link>(this.links).id(d => d.id))
//       .force('charge', d3.forceManyBody().strength(-200))
//       .force('center', d3.forceCenter(this.width / 2, this.height / 2));

//     // Create links
//     const link = this.svg.append('g')
//       .selectAll('line')
//       .data(this.links)
//       .enter().append('line')
//       .attr('stroke', '#999')
//       .attr('stroke-width', 1);

//     // Create nodes
//     const node = this.svg.append('g')
//       .selectAll('circle')
//       .data(this.nodes)
//       .enter().append('circle')
//       .attr('r', 15)
//       .attr('fill', d => colorScale(d.type))
//       .call(d3.drag<SVGCircleElement, Node>()
//         .on('start', this.dragstarted.bind(this))
//         .on('drag', this.dragged.bind(this))
//         .on('end', this.dragended.bind(this)))
//       .on('dblclick', (event: MouseEvent, d: Node) => {
//         d.fx = null;
//         d.fy = null;
//         this.simulation.alpha(1).restart();
//       });

//     // Add labels for nodes
//     const labels = this.svg.append('g')
//       .selectAll('text')
//       .data(this.nodes)
//       .enter().append('text')
//       .text(d => d.name)
//       .attr('dx', 15)
//       .attr('dy', '.35em');

//     // Add relationship labels to the links
//     const linkLabels = this.svg.append('g')
//       .selectAll('text')
//       .data(this.links)
//       .enter().append('text')
//       .attr('font-size', '8px')
//       .attr('text-anchor', 'middle')
//       .text(d => d.relationship);

//     // Handle simulation ticks
//     this.simulation.on('tick', () => {
//       link
//         .attr('x1', d => (d.source as Node).x!)
//         .attr('y1', d => (d.source as Node).y!)
//         .attr('x2', d => (d.target as Node).x!)
//         .attr('y2', d => (d.target as Node).y!);

//       node
//         .attr('cx', d => d.x!)
//         .attr('cy', d => d.y!);

//       labels
//         .attr('x', d => d.x! + 15)
//         .attr('y', d => d.y! + 4);

//       linkLabels
//         .attr('x', d => ((d.source as Node).x! + (d.target as Node).x!) / 2)
//         .attr('y', d => ((d.source as Node).y! + (d.target as Node).y!) / 2);
//     });

//     // Add legend
//     const legend = this.svg.append('g')
//       .attr('transform', `translate(${this.width - 100}, 20)`);

//     const types = Array.from(new Set(this.nodes.map(n => n.type)));

//     types.forEach((type, i) => {
//       const legendRow = legend.append('g')
//         .attr('transform', `translate(0, ${i * 20})`);

//       legendRow.append('rect')
//         .attr('width', 10)
//         .attr('height', 10)
//         .attr('fill', colorScale(type));

//       legendRow.append('text')
//         .attr('x', 20)
//         .attr('y', 10)
//         .text(type);
//     });

//     // Add zoom/pan behavior
//     const zoom = d3.zoom<SVGSVGElement, unknown>()
//       .scaleExtent([0.1, 4])
//       .on('zoom', this.zoomed);

//     this.svg.call(zoom);
//   }

//   private zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
//     this.svg.selectAll('g').attr('transform', event.transform.toString());
//   }

//   private dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
//     if (!event.active) this.simulation.alphaTarget(0.3).restart();
//     event.subject.fx = event.subject.x;
//     event.subject.fy = event.subject.y;
//   }

//   private dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
//     event.subject.fx = event.x;
//     event.subject.fy = event.y;
//   }

//   private dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
//     if (!event.active) this.simulation.alphaTarget(0);
//     // Removed: event.subject.fx = null; event.subject.fy = null;
//   }

//   close() {
//     this.dialogRef.close();
//   }
// // }
// import { HttpClient } from '@angular/common/http';
// import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import * as d3 from 'd3';

// interface Node {
//   id: string;
//   name: string;
//   type: string;
//   x?: number; // optional x position
//   y?: number; // optional y position
//   fx?: number | undefined;  // Add this line
//   fy?: number | undefined;
// }

// interface Link {
//   source: Node;
//   target: Node;
//   relationship: string;
// }

// @Component({
//   selector: 'app-popup',
//   templateUrl: './popup.component.html',
//   styleUrls: ['./popup.component.css'],
//   standalone: true,
//   imports: [CommonModule]
// })
// export class PopupComponent implements OnInit {
//   @ViewChild('container', { static: true }) container!: ElementRef;

//   private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
//   private width!: number;
//   private height!: number;
//   private simulation!: d3.Simulation<Node, Link>;

//   nodes: Node[] = [];
//   links: Link[] = [];

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private dialogRef: MatDialogRef<PopupComponent>,
//     private http: HttpClient
//   ) {
//     console.log('Popup Data:', data);
//   }

//   ngOnInit() {
//     this.fetchGraphData(this.data);
//   }

//   private fetchGraphData(data: any) {
//     // Prepare the request options
//     const requestOptions: RequestInit = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     };

//     // Make the fetch request to the backend API
//     fetch('/api/graph', requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log('Graph Data:', data);

//         this.nodes = data.nodes;
//         this.links = data.links;
//         this.createGraph();
//       })
//       .catch((error) => {
//         console.error('There was a problem with the fetch operation:', error);
//       });
//   }


//   private createGraph() {
//     const element = this.container.nativeElement;
//     this.width = element.clientWidth || 700;
//     this.height = element.clientHeight || 700;

//     this.svg = d3.select(this.container.nativeElement)
//       .append('svg')
//       .attr('width', this.width)
//       .attr('height', this.height);

//     const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

//     // Create force simulation
//     this.simulation = d3.forceSimulation<Node>(this.nodes)
//       .force('link', d3.forceLink<Node, Link>(this.links).id(d => d.id))
//       .force('charge', d3.forceManyBody().strength(-200))
//       .force('center', d3.forceCenter(this.width / 2, this.height / 2));

//     // Create links
//     const link = this.svg.append('g')
//       .selectAll('line')
//       .data(this.links)
//       .enter().append('line')
//       .attr('stroke', '#999')
//       .attr('stroke-width', 1);

//     // Create nodes
//     const node = this.svg.append('g')
//       .selectAll('circle')
//       .data(this.nodes)
//       .enter().append('circle')
//       .attr('r', 15)
//       .attr('fill', d => colorScale(d.type))
//       .call(d3.drag<SVGCircleElement, Node>()
//         .on('start', this.dragstarted.bind(this))
//         .on('drag', this.dragged.bind(this))
//         .on('end', this.dragended.bind(this)))
//       .on('dblclick', (_event: MouseEvent, d: Node) => {
//         d.fx = undefined;
//         d.fy = undefined;
//         this.simulation.alpha(1).restart();
//       });

//     // Add labels for nodes
//     const labels = this.svg.append('g')
//       .selectAll('text')
//       .data(this.nodes)
//       .enter().append('text')
//       .text(d => d.name)
//       .attr('dx', 15)
//       .attr('dy', '.35em');

//     // Add relationship labels to the links
//     const linkLabels = this.svg.append('g')
//       .selectAll('text')
//       .data(this.links)
//       .enter().append('text')
//       .attr('font-size', '8px')
//       .attr('text-anchor', 'middle')
//       .text(d => d.relationship);

//     // Handle simulation ticks
//     this.simulation.on('tick', () => {
//       link
//         .attr('x1', d => (d.source as Node).x!)
//         .attr('y1', d => (d.source as Node).y!)
//         .attr('x2', d => (d.target as Node).x!)
//         .attr('y2', d => (d.target as Node).y!);

//       node
//         .attr('cx', d => d.x!)
//         .attr('cy', d => d.y!);

//       labels
//         .attr('x', d => d.x! + 15)
//         .attr('y', d => d.y! + 4);

//       linkLabels
//         .attr('x', d => ((d.source as Node).x! + (d.target as Node).x!) / 2)
//         .attr('y', d => ((d.source as Node).y! + (d.target as Node).y!) / 2);
//     });

//     // Add zoom/pan behavior
//     const zoom = d3.zoom<SVGSVGElement, unknown>()
//       .scaleExtent([0.1, 4])
//       .on('zoom', this.zoomed);

//     this.svg.call(zoom);
//   }

//   private zoomed = (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
//     this.svg.selectAll('g').attr('transform', event.transform.toString());
//   }

//   private dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
//     if (!event.active) this.simulation.alphaTarget(0.3).restart();
//     event.subject.fx = event.subject.x;
//     event.subject.fy = event.subject.y;
//   }

//   private dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
//     event.subject.fx = event.x;
//     event.subject.fy = event.y;
//   }

//   private dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
//     if (!event.active) this.simulation.alphaTarget(0);
//   }

//   close() {
//     this.dialogRef.close();
//   }
// }
import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  type: string;
  x?: number; // optional x position
  y?: number; // optional y position
  fx?: number | undefined;  // Add this line
  fy?: number | undefined;
}

interface Link {
  source: Node;
  target: Node;
  relationship: string;
}

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PopupComponent implements OnInit {
  @ViewChild('container', { static: true }) container!: ElementRef;

  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private width!: number;
  private height!: number;
  private simulation!: d3.Simulation<Node, Link>;

  nodes: Node[] = [];
  links: Link[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PopupComponent>
  ) {
    console.log('Popup Data:', data);
  }

  ngOnInit() {
    this.fetchGraphData(this.data);
  }

  private fetchGraphData(data: any) {
    // Use the fetch API for the POST request
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    // Use the fetch API for the HTTP request
    fetch('http://localhost:3000/api/graph', requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // parse JSON response
      })
      .then((data) => {
        console.log('Graph Data:', data);
        // this.nodes = data.nodes;
        // this.links = data.links;
        // this.createGraph();
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  private createGraph() {
    const element = this.container.nativeElement;
    this.width = element.clientWidth || 700;
    this.height = element.clientHeight || 700;

    this.svg = d3.select(this.container.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create force simulation
    this.simulation = d3.forceSimulation<Node>(this.nodes)
      .force('link', d3.forceLink<Node, Link>(this.links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2));

    // Create links
    const link = this.svg.append('g')
      .selectAll('line')
      .data(this.links)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 1);

    // Create nodes
    const node = this.svg.append('g')
      .selectAll('circle')
      .data(this.nodes)
      .enter().append('circle')
      .attr('r', 15)
      .attr('fill', d => colorScale(d.type))
      .call(d3.drag<SVGCircleElement, Node>()
        .on('start', this.dragstarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragended.bind(this)))
      .on('dblclick', (_event: MouseEvent, d: Node) => {
        d.fx = undefined;
        d.fy = undefined;
        this.simulation.alpha(1).restart();
      });

    // Add labels for nodes
    const labels = this.svg.append('g')
      .selectAll('text')
      .data(this.nodes)
      .enter().append('text')
      .text(d => d.name)
      .attr('dx', 15)
      .attr('dy', '.35em');

    // Add relationship labels to the links
    const linkLabels = this.svg.append('g')
      .selectAll('text')
      .data(this.links)
      .enter().append('text')
      .attr('font-size', '8px')
      .attr('text-anchor', 'middle')
      .text(d => d.relationship);

    // Handle simulation ticks
    this.simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      labels
        .attr('x', d => d.x! + 15)
        .attr('y', d => d.y! + 4);

      linkLabels
        .attr('x', d => ((d.source as Node).x! + (d.target as Node).x!) / 2)
        .attr('y', d => ((d.source as Node).y! + (d.target as Node).y!) / 2);
    });
  }

  private dragstarted(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  private dragged(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  private dragended(event: d3.D3DragEvent<SVGCircleElement, Node, Node>) {
    if (!event.active) this.simulation.alphaTarget(0);
    // Removed: event.subject.fx = null; event.subject.fy = null;
  }

  close() {
    this.dialogRef.close();
  }
}
