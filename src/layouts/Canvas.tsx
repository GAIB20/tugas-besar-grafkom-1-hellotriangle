export default function Canvas(): JSX.Element {
  return (
    <div className="flex size-full overflow-hidden">
      <canvas
        className="grid-pattern size-full bg-[#1E1E1E]"
        id="glcanvas"
      ></canvas>
    </div>
  );
}
