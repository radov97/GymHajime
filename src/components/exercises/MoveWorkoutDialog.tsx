import SelectDropdown from '@/components/SelectDropdown';
import ModalPopup from '@/components/ModalPopup';
import { ButtonRank } from '@/lib/enums';

interface Props {
  open: boolean;
  sourceDay: number;
  targetDay: number;
  dayLabels: string[];
  labels: Record<string, string>;
  moving: boolean;
  onTargetChange: (day: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Confirms moving a persisted workout and warns that the target weekday will be replaced. */
export default function MoveWorkoutDialog({
  open,
  sourceDay,
  targetDay,
  dayLabels,
  labels,
  moving,
  onTargetChange,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <ModalPopup
      isOpen={open}
      title={labels.move}
      subtitle={labels.moveWarning}
      onClose={moving ? undefined : onCancel}
      closeLabel={`${labels.cancel} ${labels.move}`}
      closeOnBackdropClick={!moving}
      buttons={[
        {
          text: labels.cancel,
          rank: ButtonRank.Secondary,
          disabled: moving,
          onClick: onCancel,
        },
        {
          text: labels.confirmMove,
          rank: ButtonRank.Primary,
          loading: moving,
          onClick: onConfirm,
        },
      ]}
    >
      <SelectDropdown
        value={String(targetDay)}
        onChange={(value) => onTargetChange(Number(value))}
        ariaLabel={labels.moveTarget}
        label={labels.moveTarget}
        options={dayLabels.map((label, index) => ({
          value: String(index + 1),
          label,
          disabled: index + 1 === sourceDay,
        }))}
      />
    </ModalPopup>
  );
}
