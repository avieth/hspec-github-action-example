module Library where

fortyTwo :: Int
fortyTwo = 42

addTwo :: Int -> Int
addTwo = (+) 2

specialNumbers :: [Int]
specialNumbers = [42, addTwo fortyTwo]

programHalts :: (a -> b) -> Bool
programHalts = error "still can't figure out how to do this one"

data Product = Product
  { fieldA :: Int
  , fieldB :: Bool
  }
  deriving (Eq, Show)

data Sum = VariantA Int | VariantB Bool
  deriving (Eq, Show)
