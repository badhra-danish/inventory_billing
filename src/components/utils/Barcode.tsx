import Barcode from "react-barcode";
type Props = {
  value: string;
};
function BarcodeView({ value }: Props) {
  if (!value) return <p>No barcode value</p>;
  return (
    <Barcode
      value={value}
      format="CODE128"
      height={50}
      width={2}
      fontSize={12}
      renderer="svg"
      displayValue={true}
    />
  );
}

export default BarcodeView;
