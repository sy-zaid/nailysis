import { Sankey } from 'recharts-sankey';

const PredictionSankey = ({ images, combinedResult }) => {
  const data = {
    nodes: [
      ...images.map((img, i) => ({ name: `Image ${i+1}` })),
      ...combinedResult.map(res => ({ name: res.predicted_class }))
    ],
    links: [
      // Connect images to their top predictions
      { source: 0, target: 2, value: 0.95 }, // Image 1 → Melanoma
      { source: 1, target: 3, value: 0.90 }, // Image 2 → Koilonychia
    ]
  };

  return (
    <Sankey
      width={800}
      height={500}
      data={data}
      nodePadding={50}
      margin={{ left: 200, right: 200 }}
    />
  );
};