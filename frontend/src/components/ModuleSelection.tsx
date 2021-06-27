import React, { ChangeEvent } from "react";
import { Box, TextField, Typography } from "@material-ui/core";
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from "@material-ui/lab/Autocomplete";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ListSubheader from "@material-ui/core/ListSubheader";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import { ModulesQuery, Module, useModulesQuery } from "../generated/graphql";

interface ModuleSelectionProps {
  handleOnChange: (event: ChangeEvent<Module>, value: Module) => void;
  initialValue?: Module;
}

const useStyles = makeStyles({
  listbox: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const ModuleSelection: React.FC<ModuleSelectionProps> = ({
  handleOnChange,
  initialValue,
}) => {
  const [{ data, fetching }] = useModulesQuery();
  const classes = useStyles();
  const LISTBOX_PADDING = 8; // px

  function renderModules(data: ModulesQuery, fetching: boolean): Module[] {
    return data && !fetching ? data.modules : [];
  }

  const renderRow = (props: ListChildComponentProps) => {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
      style: {
        ...style,
        top: (style.top as number) + LISTBOX_PADDING,
      },
    });
  };

  const OuterElementContext = React.createContext({});

  const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  });

  const useResetCache = (data: any) => {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
      if (ref.current != null) {
        ref.current.resetAfterIndex(0, true);
      }
    }, [data]);
    return ref;
  };

  // Adapter for react-window
  const ListboxComponent = React.forwardRef<HTMLDivElement>(
    function ListboxComponent(props, ref) {
      const { children, ...other } = props;
      const itemData = React.Children.toArray(children);
      const theme = useTheme();
      const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
      const itemCount = itemData.length;
      const itemSize = smUp ? 36 : 48;

      const getChildSize = (child: React.ReactNode) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
          return 48;
        }

        return itemSize;
      };

      const getHeight = () => {
        if (itemCount > 8) {
          return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
      };

      const gridRef = useResetCache(itemCount);

      return (
        <div ref={ref}>
          <OuterElementContext.Provider value={other}>
            <VariableSizeList
              itemData={itemData}
              height={getHeight() + 2 * LISTBOX_PADDING}
              width="100%"
              ref={gridRef}
              outerElementType={OuterElementType}
              innerElementType="ul"
              itemSize={(index) => getChildSize(itemData[index])}
              overscanCount={5}
              itemCount={itemCount}
            >
              {renderRow}
            </VariableSizeList>
          </OuterElementContext.Provider>
        </div>
      );
    }
  );

  const renderGroup = (params: AutocompleteRenderGroupParams) => [
    <ListSubheader key={params.key} component="div">
      {params.group}
    </ListSubheader>,
    params.children,
  ];

  return (
    <Autocomplete
      id="moduleSelection"
      style={{ width: "100%" }}
      disableListWrap
      classes={classes}
      ListboxComponent={
        ListboxComponent as React.ComponentType<
          React.HTMLAttributes<HTMLElement>
        >
      }
      defaultValue={initialValue}
      getOptionSelected={(option, value) => option.id === value.id}
      onChange={handleOnChange}
      renderGroup={renderGroup}
      options={renderModules(data, fetching)}
      getOptionLabel={(option) => `${option.code} ${option.name}`}
      renderInput={(params) => (
        <Box mt={1}>
          <TextField {...params} variant="outlined" label="Module" />
        </Box>
      )}
      renderOption={(option) => (
        <Typography noWrap>{`${option.code} ${option.name}`}</Typography>
      )}
    />
  );
};

export default ModuleSelection;
