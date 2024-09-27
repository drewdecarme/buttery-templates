import { useTooltip } from "../hook.useTooltip";

export default () => {
  const { targetProps, tooltipProps } = useTooltip({
    dxType: "tooltip",
    dxKind: "label",
    dxLabeledBy: "save",
  });

  return (
    <>
      <button {...targetProps}>Save</button>
      <div {...tooltipProps}>Save your work to the system</div>
    </>
  );
};
